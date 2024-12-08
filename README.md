This Project is used to verify Typegoose-issues

only branches that need to be shared are to find here

**ESM NOTE**
This branch is made for ESM testing as is meant to be used in conjunction with typegoose's branch `feature/esm`.

To use the local typegoose version, either pack it into a `tgz` and install it, or simply use `yarn link @typegoose/typegoose`.

## Setup

```sh
# clone the repository
git clone https://github.com/typegoose/typegoose-testing.git

# change directory into the repository
cd typegoose-testing

# fetch all branches
git fetch --all

# if specific branch
git checkout -b local_branch_name_here origin/remote_branch_name_here

# install all packages
yarn install

# open your editor, if needed
code .

# run code
yarn run run
```
