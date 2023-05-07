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
exports.MovieDto = void 0;
const typeorm_1 = require("typeorm");
const imdb_dto_1 = require("./imdb.dto");
let MovieDto = class MovieDto {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MovieDto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'text' }),
    __metadata("design:type", String)
], MovieDto.prototype, "en_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'text' }),
    __metadata("design:type", String)
], MovieDto.prototype, "ua_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'text', unique: true }),
    __metadata("design:type", String)
], MovieDto.prototype, "href", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'numeric' }),
    __metadata("design:type", Number)
], MovieDto.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'text' }),
    __metadata("design:type", String)
], MovieDto.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'text' }),
    __metadata("design:type", String)
], MovieDto.prototype, "download_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", Number)
], MovieDto.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], MovieDto.prototype, "aws_s3_torrent_url", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => imdb_dto_1.ImdbDto),
    (0, typeorm_1.JoinColumn)({ name: 'imdb_id' }),
    __metadata("design:type", imdb_dto_1.ImdbDto)
], MovieDto.prototype, "imdb", void 0);
MovieDto = __decorate([
    (0, typeorm_1.Entity)('movie')
], MovieDto);
exports.MovieDto = MovieDto;
//# sourceMappingURL=movie.dto.js.map