import Dec from './declaration';

function params (obj:any){
    let prop = <any>[],val = null;
    if(obj.type!=='arguments'||obj.content.length === 0){
        console.log('Error:param type is not arguments');
        return null;
    }
    obj.content.map((item:any)=>{
        if(item.type ==='declaration'){
         prop.push(Dec(item).prop.replace('$',''));
        }
    });
    return prop;
}

export default params;