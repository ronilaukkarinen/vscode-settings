import VAR from './variable';
import VAL from './value';

function declaration (obj:any){
    let prop:any,val:any;
    if(obj.type!=='declaration'||obj.content.length === 0){
        console.log('Error:param type is not declaration');
        return null;
    }
    obj.content.map((item:any)=>{
        if(item.type ==='property'){
        prop = VAR(item.content[0]);
        }
        else if (item.type == 'value'){
        val = VAL(item);
        }
    });

    let newItem = {"prop":`$${prop}`,"val":val};
    return newItem;
}

export default declaration;