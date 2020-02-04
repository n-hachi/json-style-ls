#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

module.exports = {
    traverse: async function(dir_or_file){
        let stat = fs.statSync(dir_or_file);
        let last = path.basename(dir_or_file);
        if(stat.isDirectory()){
            const children = fs.readdirSync(dir_or_file);
            var tmp = [];
            for await (const child of children){
                let new_path = dir_or_file + "/" + child;
                tmp.push(await this.traverse(new_path));
            }
            ret = {[last]:tmp};
        }
        else {
            ret = last;
        }
        return ret;
    },

    run: function (){
        argv = yargs.argv;
        paths = argv._;

        if(paths.length == 0){
            paths = ['.'];
        }

        Promise.all(paths.map(async (v)=>{
            try{
                return this.traverse(v);
            } catch (e){
                return;
            }
        })).then(function(v){
            console.log(JSON.stringify(v));
        });
    }
}

