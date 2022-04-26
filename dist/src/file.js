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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.save = void 0;
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("./logger"));
function readFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fs_1.default.promises.readFile(path);
        }
        catch (error) {
            yield fs_1.default.promises.writeFile(path, '');
            return "[]";
        }
    });
}
function writeFile(path, content) {
    return fs_1.default.promises.writeFile(path, content);
}
function commit(path, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield readFile(path);
        const currentState = JSON.parse(content.toString());
        const newState = currentState.concat(payload);
        yield writeFile(path, JSON.stringify(newState, undefined, 2));
    });
}
function save(path, payload = []) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return commit(path, payload);
        }
        catch (error) {
            logger_1.default.error(`Failed to write ${payload.length} items. Error: ${error.message}`);
        }
    });
}
exports.save = save;
//# sourceMappingURL=file.js.map