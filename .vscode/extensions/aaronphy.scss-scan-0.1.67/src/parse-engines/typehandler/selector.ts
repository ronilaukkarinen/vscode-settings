import Place from './placeholder';

function selector (obj:any){
    let prop:any;
    if(obj.type!=='selector'||obj.content.length === 0){
        console.log('Error:param type is not mixin');
        return null;
    }
    obj.content.map((item:any)=>{
        
        if(item.type ==='placeholder'){
            prop = Place(item);
        }else {
            prop = '';
        } 
    });    
    return prop;
}

export default selector;