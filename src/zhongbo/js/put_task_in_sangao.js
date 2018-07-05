var zhongbo_logic={
    mounted:function(){
        var self=this
        ex.assign(this.op_funs, {
            updateFromYuan:function(){
                cfg.show_load()
                var post_data=[{fun:'updateFromYuan'}]
                ex.post('/d/ajax/zhongbo',JSON.stringify(post_data),function(resp){
                    var count =resp.updateFromYuan.count
                    cfg.hide_load()
                    layer.alert('更新完成，新增'+count+'条数据',function(){
                        location.reload()
                    })
                })
            },
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
            updateFromSan:function(){
                var taskids=ex.map(self.selected,function(item){
                    return item.san_taskid
                })
                var post_data=[{fun:'updateFromSan',taskids:taskids}]
                cfg.show_load()
                ex.post('/d/ajax/zhongbo',JSON.stringify(post_data),function(resp){
                    var new_rows = resp.updateFromSan
                    ex.each(self.selected,function(item){
                        var new_row=ex.findone(new_rows,{san_taskid:item.san_taskid})
                        ex.assign(item,new_row)
                    })
                    cfg.hide_load(400)
                })
            },
            taskToYuanjing:function(){
                //eg1
                layer.confirm('真的准备好提交到【远景系统】吗？', {icon: 3, title:'提示'}, function(index){
                    //do something
                    var pks = ex.map(self.selected,function(item){
                        return item.pk
                    })
                    var post_data=[{fun:'taskToYuanjing',pks:pks}]
                    cfg.show_load()
                    ex.post('/d/ajax/zhongbo',JSON.stringify(post_data),function(resp){
                        cfg.hide_load(400)
                    })

                    layer.close(index);
                });


            }
        })
    }
}

window.zhongbo_logic=zhongbo_logic