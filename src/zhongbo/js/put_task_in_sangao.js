var zhongbo_logic={
    mounted:function(){
        var self=this
        ex.assign(this.op_funs, {
            putTaskIntoSangao: function () {
                cfg.show_load()
                var count =self.selected.length
                ex.each(self.selected,function(item){
                    var post_data=[{fun:'putIntoSangao',pk:item.pk}]
                    ex.post('/d/ajax/zhongbo',JSON.stringify(post_data),function(resp){
                        //alert(resp)
                        var row =resp.putIntoSangao.row
                        item.san_taskid = row.taskid
                        item.status = row.status

                        count -=1
                        if(count <=0){
                            cfg.hide_load(400)
                        }
                    })
                })
            },
        })
    }
}

window.zhongbo_logic=zhongbo_logic