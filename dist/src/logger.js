"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)();
exports.logger = logger;
logger.level = (_b = (_a = process.env.LOG_LEVEL) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : 'error';
exports.default = logger;
//# sourceMappingURL=logger.js.map