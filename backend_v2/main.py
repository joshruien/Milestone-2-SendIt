from flask import Flask, jsonify, request, _request_ctx_stack
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS
from bson import json_util
import json
from auth import AuthError, requires_auth
from formatData import format_form_data

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'send_it'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/send_it'

mongo = PyMongo(app)

CORS(app)

@app.route('/', methods=['GET'])
def helloworld():
    print("Sever Online")
    return 'Server Online'


@app.route('/api/all-jobs', methods=['GET'])
# @requires_auth
def get_all_jobs():
    # gets all jobs in the database
    jobs = mongo.db.jobs

    result = jobs.find()

    result_sanitized = json.loads(json_util.dumps(result))

    return jsonify(result_sanitized)


@app.route('/api/all-jobs/<status>', methods=['GET'])
@requires_auth
def get_jobs_by_status_pending(status):
    # gets all jobs which status is pending for job listing
    jobs = mongo.db.jobs

    auth0ID = _request_ctx_stack.top.current_user['sub']
    
    result = jobs.find({'status' : status})

    result_sanitized = json.loads(json_util.dumps(result))

    return jsonify(result_sanitized)


@app.route('/api/jobs/multi-status', methods=['GET'])
@requires_auth 
def get_all_jobs_by_multi_status():
    # NEW ENDPOINT !!!
    # uses a querystring 
    # gets all jobs in the database with the specified status1 & status2
    # example:  localhost:5000/api/all-jobs/multi-status?status1=accepted&status2=inProgress
    # use query param ?by=value to set to either get the requesterid or deliverer id


    jobs = mongo.db.jobs

    auth0ID = _request_ctx_stack.top.current_user['sub']
    # uncomment me for testing without login
    # auth0ID = 'google-oauth2|117032759256070508051'
    status1 = request.args.get('status1')
    status2 = request.args.get('status2')

    
    if (status1 == None or status2 == None ):
        return 'No query string input'
    else:
        if (request.args.get('by') == 'requested') :
            result = jobs.find( {
                '$and' : [
                    {'senderID' : auth0ID},
                    {'$or' : [ {'status' : status1}, {'status' : status2} ]}
                ]
            } )
        elif (request.args.get('by') == 'delivered') :
            result = jobs.find( {
                '$and' : [
                    {'delivererID' : auth0ID},
                    {'$or' : [ {'status' : status1}, {'status' : status2} ]}
                ]
            } )
        else:
            return 'Wrong Query String'

    

    result_sanitized = json.loads(json_util.dumps(result))

    return jsonify(result_sanitized)



@app.route('/api/jobs/<status>', methods=['GET'])
@requires_auth
def get_jobs_by_status(status):
     # NEW ENDPOINT !!!

    # Gets jobs with the specified <status> 
    # and is either requested by you or deliverered by you
    # uses query string to determine whether to get jobs requested by you or delivered by you
    # example1: /api/jobs/pending?by=requested
    # example2: /api/jobs/pending?by=delivered

    jobs = mongo.db.jobs

    
    auth0ID = _request_ctx_stack.top.current_user['sub']
    # uncomment me for testing without login
    # auth0ID = 'google-oauth2|117032759256070508051'
    if (request.args.get('by') == 'requested') :
        result = jobs.find( {
            '$and' : [
                {'status' : status},
                {'senderID' : auth0ID}
            ]
        } )
    elif (request.args.get('by') == 'delivered') :
        result = jobs.find( {
            '$and' : [
                {'status' : status},
                {'delivererID' : auth0ID}
            ]
        } )
    else:
        return 'Wrong Query String'


    result_sanitized = json.loads(json_util.dumps(result))

    return jsonify(result_sanitized)


@app.route('/api/one-job/<ObjectId:job_id>', methods=['GET'])
@requires_auth
def get_jobs_by_oId(job_id):
    # gets one job with specific jobid

    jobs = mongo.db.jobs

    result = jobs.find_one_or_404(job_id)

    result_sanitized = json.loads(json_util.dumps(result))

    return jsonify(result_sanitized)


@app.route('/api/one-job/update-status/<ObjectId:job_id>/<new_status>', methods=['PUT','POST'])
@requires_auth
def update_jobs_status_by_oId(job_id, new_status):
    # updates the status of a job to <new_status> using the job_id of the job 
    print(type(job_id))
    print(job_id)
    jobs = mongo.db.jobs

    result = jobs.find_one_and_update({'_id':job_id}, {'$set': {'status':new_status}})
    print(result)
    print(type(result))

    # result_sanitized = json.loads(json_util.dumps(result))

    # return jsonify(result_sanitized)
    return jsonify('Job Updated')


@app.route('/api/one-job/update-status-id/<ObjectId:job_id>/<new_status>', methods=['PUT','POST'])
@requires_auth
def update_jobs_deliverer_and_status__by_oId(job_id, new_status):
    # updates the status of a job to <new_status> using the job_id of the job
    # if <new_status> == inProgress, also updates the delivererID to the auth0Id of the current user
    # if <new_status> == pending, updates the delivererID back to the null
    jobs = mongo.db.jobs

    auth0ID = _request_ctx_stack.top.current_user['sub']
    if (new_status == 'accepted' ):
        result = jobs.find_one_and_update({'_id':job_id}, {'$set': {'status':new_status, 'delivererID':auth0ID} } )
    elif (new_status == 'pending'):
        result = jobs.find_one_and_update({'_id':job_id}, {'$set': {'status':new_status, 'delivererID':None} } )
    elif (new_status == 'completed' or new_status == 'inProgress'): 
        result = jobs.find_one_and_update({'_id':job_id}, {'$set': {'status':new_status}})
    else:
        return jsonify('Error: invalid status update')
    # print(result)

    # result_sanitized = json.loads(json_util.dumps(result))

    # return jsonify(result_sanitized)
    return jsonify('Job Updated')


@app.route('/api/jobs', methods=['POST'])
@requires_auth
def add_job():
    # post a job and sets the 'senderID' to the auth0Id of the current user
    jobs = mongo.db.jobs 
    data = request.get_json()['values']
    formatted_data = format_form_data(data)
    auth0ID = _request_ctx_stack.top.current_user['sub']
    print(auth0ID)
    formatted_data['status'] = 'pending'
    formatted_data['senderID'] = auth0ID

    print(formatted_data)
    
    # return "test success"
    
    job_id = jobs.insert_one(formatted_data).inserted_id
    print(job_id)
    print(type(job_id))
    return 'Job Added'


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response


if __name__ == '__main__':
    app.run(debug=True, host='localhost',port=5000)