create database Chat_App

use Chat_App

create table Users(
userId    varchar(50)    primary key,
userName  varchar(25)    not null,
password  varchar(max)   not null,
firstName nvarchar(20)   not null,
lastName  nvarchar(20)   not null,
dob       date           not null,
address   nvarchar(max)  not null,
avatar varchar(max)      null,
createdAt datetime       not null,
status    int            not null
)

create table Rooms(
roomId      int identity(1, 2) primary key,
createdAt   datetime       not null default GETDATE(),
status      int            not null
)


create table RoomDetails(
roomDetailId    int identity(1, 20) primary key,
roomName    nvarchar(max)  null,
roomAvatar  nvarchar(max)  null,
roomId          int   foreign key references Rooms(roomId),
userId          varchar(50)   foreign key references Users(userId),
status          int           not null
)

create table Messages(
messageId       varchar(25)   primary key,
roomDetailId    int   foreign key references RoomDetails(roomDetailId),
content         nvarchar(50)  not null,
sender varchar(50)				foreign key references Users(userId),
createdAt       datetime      not null,
status          int           not null
)

create table Carts(
cartId int identity(1, 1) primary key,
ownerId varchar(50)  foreign key references Users(userId),
createdAt datetime not null default GETDATE(),
status bit not null,
)

create table CartDetails(
cartDetailId int identity(1, 10) primary key,
cartId       int foreign key references Carts(cartId),
userId       varchar(50) foreign key references Users(userId),
status bit not null,
)