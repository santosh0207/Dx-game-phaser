var row,col;
export const gridDiscription = (numRow=8,numCol=4)=>{
    row = numRow;
    col = numCol;
    let obj ={};
    obj.rows = numRow;
    obj.cols = numCol;
    obj.advantage = [];
    obj.disAdvantage = [];
    return obj;
}


export const assignPowerupGrid =(numAdvantage=1,numDisAdvantage=1)=>{
        
    let _arr = [];
    for(let i=0;i<numAdvantage+numDisAdvantage;i++){
        let num;
        do{
            num = randomNumberGeneration(1,(row*col));
        }while(_arr.indexOf(num)!=-1)
        _arr.push(num)
    }

    return [_arr.slice(0, numAdvantage),_arr.slice(numAdvantage, _arr.length)];
}

export const findIndex =(arr, value, prop)=>{
    return arr.map(function(e) { 
        return e[prop];
     }).indexOf(value);
}

export const removeNullFromArray =(array)=> {
    return array.filter(function (el) {
        return el != null;
      });
}

export const removeDuplicates =(array)=>{
    return [...new Set(array)]
}

export const randomNumberGeneration  = (min, max)=>{
    return Math.floor((Math.random() * max) + min);
}