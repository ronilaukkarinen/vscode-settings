"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsdi_1 = require("tsdi");
const vscode = require("vscode");
const command_1 = require("../command");
const helper_1 = require("../helper");
class UserCommand extends command_1.TokenCommand {
    selectUser(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignees = yield this.workflowManager.getAssignees(uri);
            const picks = assignees.map(assignee => ({
                label: assignee.username,
                description: '',
                assignee
            }));
            picks.push({
                label: 'Other',
                description: '',
                assignee: undefined
            });
            const selected = picks.length > 1
                ? yield vscode.window.showQuickPick(picks, {
                    ignoreFocusOut: true
                })
                : picks[0];
            if (selected) {
                let username;
                if (!selected.assignee) {
                    username = yield this.getUser();
                }
                else {
                    username = selected.assignee.username;
                }
                return username;
            }
            return undefined;
        });
    }
    getUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return vscode.window.showInputBox({
                ignoreFocusOut: true,
                placeHolder: 'username, email or fullname'
            });
        });
    }
}
let AddAssignee = class AddAssignee extends UserCommand {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.addAssignee';
    }
    runWithToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.uri) {
                throw new Error('uri is undefined');
            }
            const pullRequest = yield this.workflowManager.getPullRequestForCurrentBranch(this.uri);
            if (pullRequest) {
                if (!user) {
                    user = yield this.selectUser(this.uri);
                }
                if (user) {
                    yield this.workflowManager.addAssignee(pullRequest, user, this.uri);
                    vscode.window.showInformationMessage(`Successfully assigned ${user} to the pull request`);
                }
            }
            else {
                vscode.window.showWarningMessage('No pull request for current brach');
            }
        });
    }
};
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AddAssignee.prototype, "runWithToken", null);
AddAssignee = __decorate([
    tsdi_1.component({ eager: true })
], AddAssignee);
exports.AddAssignee = AddAssignee;
let RemoveAssignee = class RemoveAssignee extends UserCommand {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.removeAssignee';
    }
    runWithToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.uri) {
                throw new Error('uri is undefined');
            }
            const pullRequest = yield this.workflowManager.getPullRequestForCurrentBranch(this.uri);
            if (pullRequest) {
                yield this.workflowManager.removeAssignee(pullRequest);
                vscode.window.showInformationMessage(`Successfully unassigned the pull request`);
            }
            else {
                vscode.window.showWarningMessage('No pull request for current brach');
            }
        });
    }
};
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RemoveAssignee.prototype, "runWithToken", null);
RemoveAssignee = __decorate([
    tsdi_1.component({ eager: true })
], RemoveAssignee);
exports.RemoveAssignee = RemoveAssignee;
let RequestReview = class RequestReview extends UserCommand {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.requestReview';
    }
    runWithToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.uri) {
                throw new Error('uri is undefined');
            }
            const pullRequest = yield this.workflowManager.getPullRequestForCurrentBranch(this.uri);
            if (pullRequest) {
                if (!user) {
                    user = yield this.selectUser(this.uri);
                }
                if (user) {
                    yield this.workflowManager.requestReview(pullRequest.number, user, this.uri);
                    vscode.window.showInformationMessage(`Successfully requested review from ${user}`);
                }
            }
            else {
                vscode.window.showWarningMessage('No pull request for current brach');
            }
        });
    }
};
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestReview.prototype, "runWithToken", null);
RequestReview = __decorate([
    tsdi_1.component({ eager: true })
], RequestReview);
exports.RequestReview = RequestReview;
let DeleteReviewRequest = class DeleteReviewRequest extends UserCommand {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.deleteReviewRequest';
    }
    runWithToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.uri) {
                throw new Error('uri is undefined');
            }
            const pullRequest = yield this.workflowManager.getPullRequestForCurrentBranch(this.uri);
            if (pullRequest) {
                if (!user) {
                    user = yield this.selectUser(this.uri);
                }
                if (user) {
                    yield this.workflowManager.deleteReviewRequest(pullRequest.number, user, this.uri);
                    vscode.window.showInformationMessage(`Successfully canceled review request from ${user}`);
                }
            }
            else {
                vscode.window.showWarningMessage('No pull request for current brach');
            }
        });
    }
};
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeleteReviewRequest.prototype, "runWithToken", null);
DeleteReviewRequest = __decorate([
    tsdi_1.component({ eager: true })
], DeleteReviewRequest);
exports.DeleteReviewRequest = DeleteReviewRequest;
//# sourceMappingURL=user.js.map