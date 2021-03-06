#!env/bin/python3
from flask import jsonify, request, make_response, url_for, abort
from flask import current_app as app
from tinydb import TinyDB
from utils.url_helper import is_url, complete_url

db = TinyDB(app.config['DATABASE'])
blockees_table = db.table('blockees')

@app.route('/blockees/<int:blockee_id>', methods = ['GET'])
def get_blockee(blockee_id):
    blockee = blockees_table.get(eid=blockee_id)
    if blockee is None:
        abort(404)
    return jsonify({'blockee': make_public_blockee(blockee)})

@app.route('/blockees', methods=['GET'])
def get_blockees():
    # Blockees are reversed to get a LIFO ordering
    blockees_list = reversed(blockees_table.all())
    return jsonify({'blockees': list(map(make_public_blockee, blockees_list))})

@app.route('/blockees', methods=['POST'])
def add_blockee():
    if (not request.json or
        not 'name' in request.json):
        abort(400)

    if not is_url(request.json['name']):
        abort(422)

    new_blockee = {
        'name': request.json['name'],
        'url': complete_url(request.json['name'])
    }
    for b in blockees_table:
        if b['url']==new_blockee['url']: # Item has already been added
            return make_response(jsonify({'blockee': make_public_blockee(b)}), 409)
    id = blockees_table.insert(new_blockee)
    blockees_table.update({'id': id}, eids=[id])
    new_blockee = blockees_table.get(eid=id)
    return make_response(jsonify({'blockee': make_public_blockee(new_blockee)}), 201)

@app.route('/blockees/<int:blockee_id>', methods=['DELETE'])
def remove_blockee(blockee_id):
    if not blockees_table.contains(eids=[blockee_id]):
        abort(404)
    blockees_table.remove(eids=[blockee_id])
    return jsonify({'removed': url_for('get_blockee', blockee_id=blockee_id, _external=True)})

def make_public_blockee(blockee):
    new_blockee = {}
    for field in blockee:
        if field == 'id':
            new_blockee['uri'] = url_for('get_blockee', blockee_id=blockee['id'], _external=True)
        else:
            new_blockee[field] = blockee[field]
    return new_blockee


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.errorhandler(409)
def not_found(error):
    return make_response(jsonify({'error': 'Blockee already exists'}), 404)

@app.errorhandler(422)
def not_found(error):
    return make_response(jsonify({'error': 'Incorrectly formatted blockee url'}), 422)
