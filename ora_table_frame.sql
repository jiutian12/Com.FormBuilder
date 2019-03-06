
/*==============================================================*/
/* Table: FBMenuInfo                                            */
/*==============================================================*/
create table FBMenuInfo 
(
   ID                   varchar(50)                    not null,
   Code                 varchar(50)                    null,
   "Name"               varchar(100)                   null,
   "Path"               varchar(50)                    null,
   Layer                varchar(50)                    null,
   IsDetail             char(1)                        null,
   PID                  varchar(50)                    null,
   "URL"                varchar(2000)                  null,
   ICON                 varchar(50)                    null,
   AppCode              varchar(50)                    null,
   FormID               varchar(50)                    null,
   ShowType             char(1)                        null default '1',
   Ord                  varchar(50)                    null,
   Note                 varchar(2000)                  null,
   constraint PK_FBMENUINFO primary key  (ID)
)
GO
/*==============================================================*/
/* Table: FBMenuBtn                                             */
/*==============================================================*/
create table FBMenuBtn 
(
   ID                   varchar(50)                    not null,
   MenuID               varchar(50)                    null,
   "Name"                 varchar(50)                    null,
   Code                 varchar(50)                    null,
   constraint PK_FBMENUBTN primary key  (ID)
)
GO


CREATE TABLE FBUserInfo
  (
  "UID"            VARCHAR (50) NOT NULL,
  UserCode       VARCHAR (50),
  UserName       VARCHAR (50),
  Email          VARCHAR (50),
  UserPwd        VARCHAR (50),
  UserSalt       VARCHAR (50),
  OrgID          VARCHAR (50),
  DepartID       VARCHAR (50),
  UserType       VARCHAR (50),
  IDCard         VARCHAR (20),
  Ord            VARCHAR (50),
  TelPhone       VARCHAR (20),
  State          CHAR (1),
  Avavtar        VARCHAR (200),
  Note           VARCHAR (200),
  CreateTime     VARCHAR (20),
  CreateUser     VARCHAR (50),
  LastModifyTime VARCHAR (50),
  LastModifyUser VARCHAR (20),
  CONSTRAINT PK_FBUSERINFO PRIMARY KEY ("UID")
  )
CREATE TABLE FBRoleUser
  (
  ID     VARCHAR (50) NOT NULL,
  "UID"    VARCHAR (50),
  RoleID VARCHAR (50),
  CONSTRAINT PK_FBROLEUSER PRIMARY KEY (ID)
  )

  CREATE TABLE FBRolePos
  (
  RoleID VARCHAR (50) NOT NULL,
  PosID  VARCHAR (50),
  ID     VARCHAR (50) NOT NULL,
  CONSTRAINT PK_FBROLEPOS PRIMARY KEY (ID)
  )

CREATE TABLE FBRole
	(
	ID    VARCHAR (50) NOT NULL,
	Code  VARCHAR (50),
	Name  VARCHAR (50),
	Ord   VARCHAR (50),
	Note  VARCHAR (200),
	State CHAR (1),
	CONSTRAINT PK_FBROLE PRIMARY KEY (ID)
	)
  INSERT INTO FBUserInfo ("UID", UserCode, UserName, Email, UserPwd, UserSalt, OrgID, DepartID, UserType, IDCard, Ord, TelPhone, State, Avavtar, Note, CreateTime, CreateUser, LastModifyTime, LastModifyUser)
VALUES ('0001', '18678876428', '¿ÓŒ∞', '18678876428@126.com', '', NULL, '217e84fb-d86a-1cbd-d708-999a584ebfac', '516a9e23-85f1-7981-361b-fddc4f36fda9', '1', '', '', '18678876428', '0', NULL, '', NULL, NULL, NULL, NULL)
 

INSERT INTO FBUserInfo ("UID", UserCode, UserName, Email, UserPwd, UserSalt, OrgID, DepartID, UserType, IDCard, Ord, TelPhone, State, Avavtar, Note, CreateTime, CreateUser, LastModifyTime, LastModifyUser)
VALUES ('0002', '18678876421', '’≈»˝', '18678876421@126.com', 'aaaaaa', NULL, NULL, NULL, '1', '', '', '18678876421', '1', NULL, '', NULL, NULL, NULL, NULL)
  
CREATE TABLE FBPosUser
(
	ID    VARCHAR (50) NOT NULL,
	UID   VARCHAR (50),
	PosID VARCHAR (50),
	CONSTRAINT PK_FBPOSUSER PRIMARY KEY (ID)
)

CREATE TABLE FBPos
(
	ID       VARCHAR (50) NOT NULL,
	Code     VARCHAR (50),
	Name     VARCHAR (50),
	PosType  VARCHAR (50),
	Ord      INT,
	Note     VARCHAR (200),
	State    CHAR (1),
	OrgID    VARCHAR (50),
	DepartID VARCHAR (50),
	CONSTRAINT PK_FBPOS PRIMARY KEY (ID)
)


CREATE TABLE FBOrgInfo
(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (50),
	"Path"           VARCHAR (50),
	Layer          VARCHAR (50),
	IsDetail       CHAR (1),
	Pid            VARCHAR (50),
	Name           VARCHAR (50),
	OrgType        VARCHAR (50),
	Ord            INT,
	State          CHAR (1),
	Note           VARCHAR (50),
	AuthUser       VARCHAR (50),
	CreateUser     VARCHAR (50),
	CreateTime     VARCHAR (20),
	LastModifyUser VARCHAR (50),
	LastModifyTime VARCHAR (20),
	CONSTRAINT PK_FBORGINFO PRIMARY KEY (ID)
)

CREATE TABLE FBOnlineUser
(
	ID             VARCHAR (50) NOT NULL,
	"UID"            VARCHAR (50),
	LoginIP        VARCHAR (50),
	LoginMachine   VARCHAR (50),
	"State"          CHAR (1),
	CreateTime     VARCHAR (20),
	LastModifyTime VARCHAR (20),
	UserToken      VARCHAR (50),
	DeviceType     VARCHAR (20),
	CONSTRAINT PK_FBONLINEUSER PRIMARY KEY (ID)
)


CREATE TABLE FBLoginLog
(
	ID           VARCHAR (50) NOT NULL,
	"UID"          VARCHAR (50),
	LoginIP      VARCHAR (50),
	LoginMachine VARCHAR (50),
	LoginResult  VARCHAR (1000),
	LoginTime    VARCHAR (20),
	CONSTRAINT PK_FBLOGINLOG PRIMARY KEY (ID)
)

CREATE TABLE FBAuthPermission
(
	ID           VARCHAR (50) NOT NULL,
	MasterType   CHAR (1),
	MasterValue  VARCHAR (50),
	Access       VARCHAR (20),
	AccessOption VARCHAR (20),
	AccessID     VARCHAR (200),
	CONSTRAINT PK_FBAUTHPERMISSION PRIMARY KEY (ID)
)
