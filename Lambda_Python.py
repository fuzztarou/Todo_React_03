import boto3
import json
 
dynamodb = boto3.resource('dynamodb')
table    = dynamodb.Table('Todo_String')


### POST ###    
def put_item(item):
    table.put_item(
        Item = {
            "todo_item": item
        }
    )
    response = table.scan()
    return response['Items']
    
### DELETE ###
def delete_item(item):
    table.delete_item(
        Key = {
            "todo_item": item
        }
    )
    response = table.scan()
    return response['Items']

### UPDATE ###
def update_item(id, item_name):
    table.update_item(
        Key = {
            "item_id": id
        },
        UpdateExpression = "set item_name = :item_name",
        ExpressionAttributeValues = {
            ":item_name": item_name
        },
        ReturnValues="UPDATED_NEW"
    )
    
    response = table.scan()
    return response['Items']

### GET ###
def scan_item():
    response = table.scan()
    return response['Items']


### Main ###
def lambda_handler(event, context):
    
    ### メソッドの取得 ###
    req_method = event["requestContext"]["httpMethod"]
    
    ### GET ###
    if req_method == "GET":
        response_item = scan_item()
        
    ### POST ###
    if req_method == "POST":
        item = event["queryStringParameters"]["todo_item"]
        response_item = put_item(item)

    ### DELETE ###
    if req_method == "DELETE":
        item = event["queryStringParameters"]["todo_item"]
        response_item = delete_item(item)

    response = response_item
    
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
        },
        'body': json.dumps(response)
    }