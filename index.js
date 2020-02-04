#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

async function traverse(dir_or_file){
    let stat = fs.statSync(dir_or_file);
    let last = path.basename(dir_or_file);
    if(stat.isDirectory()){
        const children = fs.readdirSync(dir_or_file);
        var tmp = [];
        for await (const child of children){
            let new_path = dir_or_file + "/" + child;
            tmp.push(await traverse(new_path));
        }
        ret = {[last]:tmp};
    }
    else {
        ret = last;
    }
    return ret;
};

function main(){
    argv = yargs.argv;
    files = argv._
    if(files.length == 0){
        files = ['.'];
    }

    (async()=>{
        result = await Promise.all(files.map(async (v)=>{
            try{
                return traverse(v);
            } catch (e){
                return;
            }
        }));

        result.forEach((elem)=>{
            console.log(JSON.stringify(elem));
        });
    })();
}

main();
