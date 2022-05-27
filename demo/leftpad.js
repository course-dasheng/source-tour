

// 业务代码
// 给一个字符串，前面补0 

// 业务版本
function leftpad(str,length,ch){
  let len = length-str.length+1
  return Array(len).join(ch)+str
}

// 10个字符串
// 1          不要
// 11         留下
// 1111       不要
// 11111111   留下
// 位运算+二分的版本
// 1010 //二进制的10  8+2
function leftpad1(str,length,ch){
  let len = length-str.length
  let total = ""
  while(true){
    if(len & 1){
      total += ch
    }
    if(len==1){
      return total+str
    }
    ch += ch
    len = len>>1
  }
}
// ch '0'
// len:10 
// total  = ""

// // 10/2 = 5 余0 
// len:5
// ch: '00'
// total:""
// // 5/2 = 2 余1
// total ：'00'
// ch: '0000'
// //2/2 = 1 余0
// total :'00'
// ch:'00000000'
// 1/2 = 1余0
// len 1 
function leftpad2(str,length,ch){
  let len = length-str.length
  let total = ""
  while(true){
    if(len%2 == 1){
      total += ch
    }
    if(len==1){
      return total+str
    }
    ch += ch
    len = parseInt(len/2)
  }
}
console.time('业务型实现')
for(let i=0;i<10000;i++){
  leftpad('hello',50000,'0')
}
console.timeEnd('业务型实现')


console.time('位运算实现')
for(let i=0;i<10000;i++){
  leftpad1('hello',50000,'0')
}
console.timeEnd('位运算实现')


console.time('原生padstart')
for(let i=0;i<10000;i++){
  'hello'.padStart(50000,'0')
}
console.timeEnd('原生padstart')
