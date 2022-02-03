import admin = require('firebase-admin');
import { completeProject, incrementProgress } from './project';
import { setClaim } from './auth';

admin.initializeApp();

exports.setClaim = setClaim

exports.incrementProgress = incrementProgress

exports.completeProject = completeProject

