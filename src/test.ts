// NodeJS: 18.5.0
// MongoDB: 5.0 (Docker)
// Typescript 4.7.4
import * as path from 'path';
import { ChildProcess, spawn } from 'child_process';
import EventEmitter = require('events');
import { MongoClient } from 'mongodb';
import { promises as fspromises } from 'fs';
import 'colors';

const instancePorts = [27020, 27021, 27022];
const binaryPath = './mongobin';

const processes = [];

interface IObj {
  process: ChildProcess | undefined;
  started: boolean;
  primary: boolean;
}

async function startInstances() {
  const events = new EventEmitter();
  const p1 = Promise.all(
    instancePorts.map(
      (mport) =>
        new Promise<void>((res) =>
          events.on('started', (eport) => {
            if (eport === mport) {
              return res();
            }
          })
        )
    )
  );
  for (const port of instancePorts) {
    const obj: IObj = { process: undefined, started: false, primary: false };
    const dbpath = path.resolve(__dirname, port.toString());
    await fspromises.mkdir(dbpath, { recursive: true });

    const childProcess = spawn(path.resolve(binaryPath), [
      '--port',
      port.toString(),
      '--dbpath',
      dbpath,
      '--replSet',
      'testset',
      '--noauth',
      '--storageEngine',
      'ephemeralForTest',
      '--bind_ip',
      '127.0.0.1',
    ]);
    childProcess.stderr?.on('data', (data) => console.log(`STDERR[${port}]`.grey, data.toString().trim()));
    childProcess.stdout?.on('data', (data) => {
      const line = data.toString().trim();
      console.log(`STDOUT[${port}]`.grey, line);

      if (/waiting for connections/gim.test(line)) {
        obj.started = true;
        events.emit('started', port);
      }

      if (/transition to primary complete; database writes are now permitted/gim.test(line)) {
        obj.primary = true;
        events.emit('primary', port);
      }
    });
    childProcess.on('close', () => console.log(`Instance ${port} closed`.red));
    childProcess.on('error', (err) => console.log(`Instance ${port} errored:`.red, err));

    obj.process = childProcess;
    processes.push(obj);
  }

  await p1;

  const uris = instancePorts.map((v) => `mongodb://127.0.0.1:${v}/`);

  const con = await MongoClient.connect(uris[0], { directConnection: true });
  const adminDb = con.db('admin');
  const members = uris.map((uri, index) => ({
    _id: index,
    host: uri.replace(/(?:^mongodb:\/{2})|(?:\/.*$)|(?:.*@)/gim, ''),
  }));
  const rsConfig = {
    _id: 'testset',
    members,
    writeConcernMajorityJournalDefault: false,
    settings: {
      electionTimeoutMillis: 500,
    },
  };

  const p2 = new Promise<void>((res) => events.on('primary', () => res()));

  console.log('init'.bgRed);
  await adminDb.command({ replSetInitiate: rsConfig });

  await p2;

  await con.close();
}

async function stopInstances() {
  await Promise.all(
    instancePorts.map(async (port) => {
      const con = await MongoClient.connect(`mongodb://127.0.0.1:${port}`, { directConnection: true });
      const admin = con.db('admin');

      try {
        console.log('before command'.bgGreen);
        await admin.command({ shutdown: 1, force: true, timeoutSecs: 1 });
        console.log('after command'.bgGreen);
      } catch (err) {
        console.error('error happened'.red, err);
      } finally {
        console.log('before close'.bgGreen);
        const beforeClose = Date.now();
        await con.close();
        const afterClose = Date.now();
        console.log('after close:'.bgGreen, (afterClose - beforeClose) / 1000); // expecting 30s in 4.8.0 and ~2s in 4.7.3
      }
    })
  );
}

(async () => {
  console.log('starting'.green);
  await startInstances();
  console.log('started'.green);
  const startedTime = Date.now();
  console.log('stopping'.green);
  await stopInstances();
  console.log('stopped'.green);
  const stopTime = Date.now();

  console.log('stopping time:'.green, (stopTime - startedTime) / 1000); // expecting 30s in 4.8.0 and ~2s in 4.7.3
})();
