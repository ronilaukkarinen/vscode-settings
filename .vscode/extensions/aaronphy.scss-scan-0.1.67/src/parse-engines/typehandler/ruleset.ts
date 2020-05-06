import Selector from './selector';

function ruleset (obj:any){
    let prop:any,val:any;
    if(obj.type!=='ruleset'||obj.content.length === 0){
        console.log('Error:param type is not ruleset');
        return null;
    }
    obj.content.map((item:any)=>{
       
        if(item.type === 'selector') {
           prop = Selector(item);  
        } else if(item.type === 'block') {
           val = '';
        }

    });
    let newItem = {"prop":`${prop}`, "val":val};
    return newItem;
}

export default ruleset;