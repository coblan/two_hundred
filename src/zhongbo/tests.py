from django.test import TestCase
from zhongbo.port_yuan import base64Image
# Create your tests here.
class YuanTestCase(TestCase):
    #def setUp(self):
        #Animal.objects.create(name="lion", sound="roar")
        #Animal.objects.create(name="cat", sound="meow")

    def test_some_fun(self):
        """ """
        ff = base64Image('http://10.231.18.4/Mediainfo/18/2018/6/2/18_180602084906_1884.jpg')
        self.assertEqual(ff[:40] , 'data:image/jpeg;base64,/9j/4AAQSkZJRgABA')
        #print(ff)
        
        
