import openfoodfacts

# User-Agent is mandatory
api = openfoodfacts.API(user_agent="MyAwesomeApp/1.0")

code = "3017620422003"
item = api.product.get(code, fields=["code", "product_name"])
# {'code': '3017620422003', 'product_name': 'Nutella'}


print(item)