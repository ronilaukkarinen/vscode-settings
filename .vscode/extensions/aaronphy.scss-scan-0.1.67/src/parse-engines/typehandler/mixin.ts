import Arguments from './arguments';

function mixin (obj:any){
    let prop:any,val:any;
    if(obj.type!=='mixin'||obj.content.length === 0){
        console.log('Error:param type is not mixin');
        return null;
    }
    obj.content.map((item:any)=>{
        if(item.type ==='arguments'){
         val = Arguments(item).join(',');
        }else if (item.type==='ident') {
         prop = item.content   
        }
    });

    let newItem = {"prop":`${prop}`, "val":val};
    return newItem;
}

export default mixin;