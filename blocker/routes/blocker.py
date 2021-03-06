#!env/bin/python3
from flask import json, jsonify, request, make_response, abort
from flask import current_app as app
from tinydb import TinyDB, Query
from utils.host_writer import HostWriter
from routes.blockees import get_blockees

hosts_file_path = app.config['HOSTS_FILE']
host_writer = HostWriter(hosts_file_path)
db = TinyDB(app.config['DATABASE'])
blocker = db.table('blocker')

@app.route('/blocker', methods = ['GET'])
def get_blocker():
    State = Query()
    blocker_state = blocker.get(State.state != None)
    if blocker_state is None:
        blocker_state = {'state': 'inactive'}
    return jsonify({'blocker': blocker_state})

@app.route('/blocker', methods=['PUT'])
def set_blocker_state():
    # Check api call error
    if (not request.json or
        'state' not in request.json or
        (request.json['state'] not in ['active', 'inactive'])):
        abort(400)

    # Retrieve the appropriate urls to be blocked
    blockees = json.loads(get_blockees().get_data())['blockees']
    hosts = []
    for host_obj in blockees:
        hosts.append(host_obj['url'])

    # Edit hosts file
    if (request.json['state'] == 'active'):
        host_writer.block_hosts(hosts)
    else:
        host_writer.unblock_hosts()

    # Edit blocker status database entry
    State = Query()
    if blocker.contains(State.state != None):
        blocker.update({'state': request.json['state']}, cond=State.state!=None)
    else:
        blocker.insert({'state': request.json['state']})
    return jsonify({'new_state': request.json['state']})

@app.errorhandler(400)
def unexpected_payload(error):
    return make_response(jsonify({'error': 'Expected JSON payload with "state" set to "active" or "inactive"'}), 400)
