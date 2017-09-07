const fs = require('fs');
const test = require('tape');
const { resolve } = require('path');
const ctx = require('../')('data');

test('creates directory & file if none exists', t => {
  const fp = resolve('./data/test.json');
  const dir = resolve('./data');
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
  if (fs.existsSync(dir)) fs.rmdirSync(dir);

  const repo = ctx.file('test');
  const record = { name: 'test 0', createdOn: new Date().valueOf() };
  repo
    .append(record)
    .then(result => t.ok(result._id, '_id was assigned to the record'))
    .catch(e => t.notOk(e, 'append threw an error'));

  t.plan(1);
});

test('appends record to existing file', t => {
  const repo = ctx.file('test');
  const record = { name: 'test 1', createdOn: new Date().valueOf() };
  repo
    .append(record)
    .then(result =>
      repo
        .get()
        .then(results => {
          const appended = results.find(x => x._id === result._id);
          t.ok(results.length > 1, 'results has more than one record');
          t.ok(appended, 'results has new record');
        })
        .catch(e => t.notOk(e, 'get threw an error'))
    )
    .catch(e => t.notOk(e, 'append threw an error'));

  t.plan(2);
});

test('gets the record by id', t => {
  const repo = ctx.file('test');
  const record = { name: 'test 2', createdOn: new Date().valueOf() };
  repo
    .append(record)
    .then(created =>
      repo
        .getById(created._id)
        .then(getById => {
          const updatedRecord = Object.assign({}, record, { _id: created._id });
          t.deepEqual(getById, updatedRecord, 'getById returned the record');
        })
        .catch(e => t.notOk(e, 'getById threw an error'))
    )
    .catch(e => t.notOk(e, 'append threw an error'));

  t.plan(1);
});

test('updates the record', t => {
  const repo = ctx.file('test');
  const record = { name: 'test 3', createdOn: new Date().valueOf() };
  repo
    .append(record)
    .then(created =>
      repo
        .update(Object.assign({}, created, { updatedOn: new Date().valueOf() }))
        .then(updated => t.ok(updated.updatedOn, 'record was updated'))
        .catch(e => t.notOk(e, 'update threw an error'))
    )
    .catch(e => t.notOk(e, 'append threw an error'));

  t.plan(1);
});

test('removes the record', t => {
  const repo = ctx.file('test');
  const record = { name: 'test 4', createdOn: new Date().valueOf() };
  repo
    .append(record)
    .then(created =>
      repo
        .remove(created._id)
        .then(removed => t.equal(removed, created._id, 'record was removed'))
        .catch(e => t.notOk(e, 'update threw an error'))
    )
    .catch(e => t.notOk(e, 'append threw an error'));

  t.plan(1);
});