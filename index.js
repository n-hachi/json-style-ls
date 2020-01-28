const fs = require('fs');
const yargs = require('yargs');

async function traverse(path){
    stat = fs.statSync(path);
    ary = path.split('/');

    let last = ary[ary.length - 1];
    if(stat.isDirectory()){
        const dir = await fs.promises.opendir(path);
        var tmp = [];
        for await (const dirent of dir){
            let new_path = path + "/" + dirent.name;
            tmp.push(await traverse(new_path));
        }
        ret = {[last]:tmp};
    }
    else {
        ret = last;
    }
    return ret;
};

argv = yargs.argv;
files = argv._
if(files.length == 0){
    files = ['.'];
}

var result = null;
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
