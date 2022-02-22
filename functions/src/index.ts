import admin = require('firebase-admin');
import { completeProject, incrementProgress, startProject } from './project';
import { setClaim } from './auth';

admin.initializeApp();

exports.setClaim = setClaim;

exports.incrementProgress = incrementProgress;

exports.completeProject = completeProject;

exports.startProject = startProject;


