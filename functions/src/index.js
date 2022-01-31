"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var functions = require("firebase-functions");
var admin = require("firebase-admin");
admin.initializeApp();
exports.setClaim = functions.region('europe-west2').https.onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(context.auth && context.auth.token.admin)) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, admin.auth().setCustomUserClaims(context.auth.uid, data)];
            case 2:
                _a.sent();
                return [2 /*return*/, true];
            case 3:
                e_1 = _a.sent();
                console.error(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, false];
        }
    });
}); });
exports.incrementProgress = functions.region('europe-west2').https.onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var store_1, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!context.auth) return [3 /*break*/, 4];
                store_1 = admin.firestore();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store_1.runTransaction(function (transaction) { return __awaiter(void 0, void 0, void 0, function () {
                        var projectSnapshot, project, settingsSnapshot, settings;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, transaction.get(store_1.collection("projects").doc(data.projectID))];
                                case 1:
                                    projectSnapshot = _a.sent();
                                    if (!projectSnapshot.exists) {
                                        throw ("Project ".concat(data.projectID, " does not exist"));
                                    }
                                    project = projectSnapshot.data();
                                    if (!(parseInt(data.exerciseID) < project.exerciseCount - 1)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, transaction.get(store_1.collection("projects").doc(data.projectID).collection('settings').doc(context.auth.uid))];
                                case 2:
                                    settingsSnapshot = _a.sent();
                                    if (!settingsSnapshot.exists) {
                                        throw ("No settings could be found for that user");
                                    }
                                    settings = settingsSnapshot.data();
                                    if (settings.progress == parseInt(data.exerciseID)) {
                                        console.log("Incrementing progress from ".concat(settings.progress, " for user ").concat(context.auth.uid));
                                        transaction.update(store_1.collection('projects').doc(data.projectID).collection('settings').doc(context.auth.uid), {
                                            'progress': settings.progress + 1
                                        });
                                    }
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=index.js.map