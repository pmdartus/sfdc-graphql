#!/usr/bin/env babel-node

import fetch from 'isomorphic-fetch';

const heroObjects = new Set(
  'Account',
  'Contact',
  'Campaign',
  'Opportunity',
  'Task',
  'Event',
  'Lead',
  'Note'
);

async function fetchJSON(route) {
  const urlToFetch = process.env.DEV_INSATNCE + '/services/data/v36.0' + route;

  const response = await fetch(urlToFetch, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '
    },
  });

  if (response.status !== 200)
    throw new Error(`Invalid server response`);

  const json = await response.json();
  return json;
}

async function describeGlobal() {
  return fetchJSON('/sobjects');
}

async function describeEntity(entityName) {
  return fetchJSON(`/sobjects/${entityName}/describe`);
}

async function createSchema() {
  // Retrive all the available objects
  const globalDescribe = await describeGlobal();

  // Filter only the main entites from the list
  const mainEntities = globalDescribe.sobjects
    .filter(({ name }) => heroObjects.contains(name));

  // Get description of each entities
  const entityDescribe = await mainEntities.map(({ name }) => describeEntity(name));
  
}

createSchema()
  .then(console.log)
  .catch(console.error)
