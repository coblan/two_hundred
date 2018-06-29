from helpers.director.shortcut import FieldsPage, page_dc

class home(FieldsPage):
    template = 'hello/home.html'
    def get_label(self): 
        return '主页'
    
    def get_context(self): 
        return {
            
        }


page_dc.update({
    'home': home,
})