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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImdbDto = void 0;
const typeorm_1 = require("typeorm");
let ImdbDto = class ImdbDto {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ImdbDto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], ImdbDto.prototype, "en_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], ImdbDto.prototype, "poster", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'numeric' }),
    __metadata("design:type", Number)
], ImdbDto.prototype, "imdb_rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'numeric' }),
    __metadata("design:type", Number)
], ImdbDto.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'json' }),
    __metadata("design:type", String)
], ImdbDto.prototype, "json", void 0);
ImdbDto = __decorate([
    (0, typeorm_1.Entity)('imdb')
], ImdbDto);
exports.ImdbDto = ImdbDto;
//# sourceMappingURL=imdb.dto.js.map