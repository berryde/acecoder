import { initializeApp } from 'firebase-admin/app';
import { completeProject, incrementProgress, startProject } from './project';
import { setClaim } from './auth';

initializeApp();

exports.setClaim = setClaim;

exports.incrementProgress = incrementProgress;

exports.completeProject = completeProject;

exports.startProject = startProject;
