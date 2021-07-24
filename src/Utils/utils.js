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