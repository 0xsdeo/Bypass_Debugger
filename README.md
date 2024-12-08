# Bypass_Debugger

## Intro

该脚本可bypass掉：

1. new Function --> debugger
2. constructor --> debugger
3. eval --> debugger

## 注意事项

1. 如果发现hook后打开F12还是存在debugger，**建议开着F12在刷新一次。**

2. 我的这段Bypass Debugger脚本，目前已知的只有以下这两种情况不能被bypass掉：
```js
var dbg = function (){
    debugger;
}
setInterval(dbg,3000);
```
![1733639165304](image/README/1733639165304.png)
以及直接将debugger写在script当中的：
![1733639172782](image/README/1733639172782.png)
以上这两种设条件断点就能过(如果不知道怎么设置条件断点的可以去看一下我之前写的的反调试与反反调试一文)，或者替换也行，不需要hook的，所以我就暂时没去管这个。

## Contact

如有bug或其他问题可提交issues，或者关注公众号Spade sec联系我。