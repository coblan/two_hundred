var zhongbo_logic={
    mounted:function(){
        var self=this
        ex.assign(this.op_funs, {
            putTaskIntoSangao: function () {
                ex.each(self.selected,function(item){
                    var post_data=[{fun:'putIntoSangao',pk:item.pk}]
                    ex.post('/d/ajax/zhongbo',JSON.stringify(post_data),function(resp){
                        alert(resp)
                    })
                })
            },
        })
    }
}

window.zhongbo_logic=zhongbo_logic