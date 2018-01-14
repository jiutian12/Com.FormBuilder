 

/*数据库连接配置*/
Create Table If Not Exists FBDBSetting
	(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (100),
	DBType         VARCHAR (100),
	Name           VARCHAR (100),
	IPAddress      VARCHAR (100),
	UserName       VARCHAR (100),
	PassWord       VARCHAR (100),
	IsUsed         CHAR (1),
	CreateUser     VARCHAR (50),
	CreateTime     VARCHAR (20),
	LastModifyUser VARCHAR (50),
	LastModifyTime VARCHAR (20),
	CONSTRAINT PK_FBDBSETTING PRIMARY KEY (ID)
	)
GO



/*数据对象表*/
Create Table If Not Exists FBDataObject
	(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (50),
	TableName      VARCHAR (100),
	AiasName       VARCHAR (100),
	DataSource     VARCHAR (50),
	Note           VARCHAR (50),
	CreateUser     VARCHAR (50),
	CreateTime     VARCHAR (20),
	LastModifyUser VARCHAR (50),
	LastModifyTime VARCHAR (20),
	CONSTRAINT PK_FBDATAOBJECT PRIMARY KEY (ID)
	)
GO
/*数据对象列信息*/
Create Table If Not Exists FBDataObjectCols
	(
	ID           VARCHAR (50) NOT NULL,
	ObjectID     VARCHAR (50),
	Code         VARCHAR (100),
	Name         VARCHAR (100),
	DataType     VARCHAR (20),
	Length       VARCHAR (20),
	`Decimal`    VARCHAR (20),
	DefaultValue VARCHAR (200),
	IsRequired   CHAR (1),
	IsUninque    CHAR (1),
	IsPrimary    CHAR (1),
	IsSys        CHAR (1),
	Note         VARCHAR (200),
	ord          VARCHAR (50),
	CONSTRAINT PK_FBDATAOBJECTCOLS PRIMARY KEY (ID)
	)
GO
/*================数据对象End=================*/


/*数据模型主表*/
Create Table If Not Exists FBDataModel
	(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (100),
	Name           VARCHAR (100),
	DataSource     VARCHAR (20),
	MainObectID    VARCHAR (50),
	PKCOL          VARCHAR (200),
	CreateUser     VARCHAR (50),
	CreateTime     VARCHAR (20),
	LastModifyUser VARCHAR (50),
	LastModifyTime VARCHAR (20),
	EnableCache    CHAR (1),
	DetailSaveMode CHAR (1),
	CONSTRAINT PK_FBDATAMODEL PRIMARY KEY (ID)
	)
GO

/*数据模型列信息*/
Create Table If Not Exists FBDataModelCols
	(
	ID             VARCHAR (50) NOT NULL,
	ModelID        VARCHAR (50),
	Code           VARCHAR (100),
	Label          VARCHAR (100),
	Name           VARCHAR (100),
	DataType       VARCHAR (50),
	Length         VARCHAR (50),
	isList         CHAR (1),
	isCard         CHAR (1),
	isReadOnly     CHAR (1),
	isUpdate       CHAR (1),
	isVirtual      CHAR (1),
	VirtualExpress VARCHAR (1000),
	ParentID       VARCHAR (50),
	RelationID     VARCHAR (50),
	isRelated      CHAR (1),
	ModelObjectID  VARCHAR (50),
	isPrimary      CHAR (1),
	`DECIMAL`      VARCHAR (20),
	Ord            VARCHAR (20),
	CONSTRAINT PK_FBDATAMODELCOLS PRIMARY KEY (ID)
	)
GO

 
/*数据模型表关联管理*/
Create Table If Not Exists FBDataModelObjects
	(
	ID        VARCHAR (50) NOT NULL,
	ObjectID  VARCHAR (50),
	Code      VARCHAR (100),
	Name      VARCHAR (100),
	`Level`   CHAR (1),
	ParentID  VARCHAR (50),
	isMain    CHAR (1),
	Filter    text,
	Sort      text,
	ModelID   VARCHAR (50),
	PKCOLName VARCHAR (50),
	Tree      text,
	Label     VARCHAR (50),
	Condition text,
	isSave    CHAR (1),
	CONSTRAINT PK_FBDATAMODELOBJECTS PRIMARY KEY (ID)
	)
GO


/*数据模型字段关联*/
Create Table If Not Exists FBDataModelRealtions
	(
	ID                 VARCHAR (50) NOT NULL,
	ModelID            VARCHAR (50),
	ObjectID           VARCHAR (50),
	ObjectCode         VARCHAR (100),
	ObjectLabel        VARCHAR (100),
	IsMainObject       CHAR (1),
	ModelObjectID      VARCHAR (50),
	Filter             VARCHAR (500),
	FilterExt          VARCHAR (500),
	JoinType           CHAR (1),
	ModelObjectCol     VARCHAR (50),
	ModelObjectColCode VARCHAR (50),
	CONSTRAINT PK_FBDATAMODELREALTIONS PRIMARY KEY (ID)
	)
GO


/*模型删除检查表*/
Create Table If Not Exists FBModelDeleteCheck(
	ID           VARCHAR (50) NOT NULL,
	ModelID      VARCHAR (50),
	ObjectID     VARCHAR (50),
	RelationID   VARCHAR (50),
	TableName    VARCHAR (50),
	RefFilter    VARCHAR (500),
	ExtendFilter VARCHAR (2000),
	DeleteTip    VARCHAR (2000),
	IsUsed       CHAR (1),
	CONSTRAINT PK_FBDeleteCheck PRIMARY KEY (ID)
	)
GO

/*模型保存检查表*/
Create Table If Not Exists FBModelModifyCheck(
	(
	ID        VARCHAR (50) NOT NULL,
	ObjectID  VARCHAR (50),
	TableName VARCHAR (50),
	Filter    VARCHAR (2000),
	Tips      VARCHAR (2000),
	IsUsed    CHAR (1),
	ModelID   VARCHAR (50),
	CONSTRAINT PK_FBModelModifyCheck PRIMARY KEY (ID)
	)
GO


/*模型动作扩展SQL*/
Create Table If Not Exists FBModelSQL(
	ID        	VARCHAR (50) NOT NULL,
	ModelID   	VARCHAR (50),
	SQLInfo   	VARCHAR (2000),
	ActionType  VARCHAR (50),
	Tips      VARCHAR (200),
	IsUsed    CHAR (1),
	CONSTRAINT PK_FBModelSQL PRIMARY KEY (ID)
)
GO

/*================数据模型End=================*/


/*数据源信息*/
Create Table If Not Exists FBDataSource
	(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (50),
	Name           VARCHAR (100),
	DsType         CHAR (1),
	DsCode         VARCHAR (50),
	SqlInfo        text,
	Reflect        VARCHAR (1000),
	RemoteURL      VARCHAR (1000),
	Tree           VARCHAR (1000),
	IsUpdate       CHAR (1),
	CreateTime     VARCHAR (20),
	CreateUser     VARCHAR (50),
	LastModifyTime VARCHAR (20),
	LastModifyUser VARCHAR (50),
	CONSTRAINT PK_FBDATASOURCE PRIMARY KEY (ID)
	)
GO

/*数据字段信息*/
Create Table If Not Exists FBDataSourceCols
	(
	ID       VARCHAR (50) NOT NULL,
	DSID     VARCHAR (50),
	Code     VARCHAR (50),
	Name     VARCHAR (50),
	DataType CHAR (1),
	CONSTRAINT PK_FBDATASOURCECOLS PRIMARY KEY (ID)
	)
GO

/*================SQL业务End=================*/


/*附件信息表*/
Create Table If Not Exists FBFileSave(
	ID         VARCHAR (50) NOT NULL,
	FileID     VARCHAR (50),
	FileName   VARCHAR (200),
	FilePath   VARCHAR (200),
	CreateUser VARCHAR (50),
	CreateTime VARCHAR (20),
	FileExt    VARCHAR (50),
	FrmID      VARCHAR (50),
	DataID     VARCHAR (50),
	Note       VARCHAR (200)
)
GO

/*表单定义主表*/
Create Table If Not Exists FBForm
	(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (50),
	Name           VARCHAR (50),
	Title          VARCHAR (50),
	Type           CHAR (1),
	ModelID        VARCHAR (50),
	BaseController VARCHAR (50),
	Theme          VARCHAR (50),
	CodeEngine     VARCHAR (50),
	HtmlInfo       text,
	JSInfo         text,
	CSSInfo        text,
	LayoutConfig   text,
	CreateTime     VARCHAR (20),
	CreateUser     VARCHAR (50),
	LastModifyTime VARCHAR (20),
	LastModifyUser VARCHAR (50),
	PageLayout     text,
	Config         text,
	DefaultInfo    text,
	FSMID          VARCHAR (50),
	UserJS         text,
	Note           VARCHAR (200),
	ExpressInfo    text,
	CONSTRAINT PK_FBFORM PRIMARY KEY (ID)
	)
GO


/*表单引入sql业务*/
Create Table If Not Exists FBFormDS
	(
	ID         VARCHAR (50) NOT NULL,
	FormID     VARCHAR (50),
	DSID       VARCHAR (50),
	GroupInfo  VARCHAR (50),
	SingleLoad CHAR (1),
	CONSTRAINT PK_FBFORMDS PRIMARY KEY (ID)
	)
GO

/*表单工具栏*/
Create Table If Not Exists FBFormToolBar
	(
	ID          VARCHAR (50) NOT NULL,
	FormID      VARCHAR (50),
	IsRoot      CHAR (1),
	BarType     CHAR (1),
	TypeOptions text,
	Icon        VARCHAR (50),
	Func        text,
	ParentID    VARCHAR (50),
	Ord         VARCHAR (50),
	IsUsed      CHAR (1),
	IsSys       CHAR (1),
	BizObject   VARCHAR (50),
	`Text`      VARCHAR (50),
	IsFixed     CHAR (1) DEFAULT ('0'),
	PropName    VARCHAR (50),
	BarID       VARCHAR (50),
	Align       CHAR (1),
	Action      VARCHAR (50),
	BtnStyle    CHAR (1),
	CONSTRAINT PK_FBFORMTOOLBAR PRIMARY KEY (ID)
	)
GO


/*表单绑定依赖字段信息*/
Create Table If Not Exists FBFormRef(
	ID       VARCHAR (50) NOT NULL,
	FormID   VARCHAR (50),
	ModelID  VARCHAR (50),
	ObjectID VARCHAR (50),
	ColList  VARCHAR (1000),
	DSID     VARCHAR (50),
	RefType  CHAR (1),
	RefValue VARCHAR (500),
	RefID    VARCHAR (50),
	CONSTRAINT PK_FBFormRef PRIMARY KEY (ID)
	)
GO

/*表单引入自定义样式和脚本*/
Create Table If Not Exists FBFormLink(
	ID       VARCHAR (50),
	FormID   VARCHAR (50),
	LinkType CHAR (1),
	LinkURL  VARCHAR (50),
	IsEnable CHAR (1),
	Note     VARCHAR (500),
	IsSys    CHAR (1),
	Ord      VARCHAR (20),
	CONSTRAINT PK_FBFormLink PRIMARY KEY (ID)
	)
GO


/*元数据资源表*/
Create Table If Not Exists FBMetaData
	(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (100),
	Name           VARCHAR (100),
	Type           CHAR (1),
	CreateTime     VARCHAR (20),
	CreateUser     VARCHAR (50),
	LastModifyTime VARCHAR (20),
	LastModifyUser VARCHAR (50),
	State          CHAR (1),
	ParentID       VARCHAR (50),
	IsFolder       CHAR (1),
	UserID         VARCHAR (50),
	ModuleID       VARCHAR (50),
	CONSTRAINT PK_FBMETADATA PRIMARY KEY (ID)
	)
GO


/*元数据模块*/
Create Table If Not Exists FBMetaModule(
	ID       VARCHAR (50) NOT NULL,
	Code     VARCHAR (50),
	Name     VARCHAR (50),
	Ord      VARCHAR (50),
	IsEnable CHAR (1),
	ParentID VARCHAR (50),
	CONSTRAINT PK_FBMetaModule PRIMARY KEY (ID)
	)
GO

/*元数据依赖表*/
Create Table If Not Exists FBMetaDependence
	(
	SourceID   VARCHAR (50),
	SourceType CHAR (1),
	TargetID   VARCHAR (50),
	TargetType CHAR (1)
	)
GO

/*元数据类型字典*/
Create Table If Not Exists FBMetaType
	(
	ID   VARCHAR (50) NOT NULL,
	Code VARCHAR (50),
	Name VARCHAR (50)
	)
GO

/*智能帮助主表*/
Create Table If Not Exists FBSmartHelp
	(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (100),
	Name           VARCHAR (100),
	Title          VARCHAR (100),
	ModelID        VARCHAR (50),
	Sort           text,
	Filter         text,
	ViewType       CHAR (1),
	CreateTime     VARCHAR (20),
	CreateUser     VARCHAR (50),
	LastModifyTime VARCHAR (20),
	LastModifyUser VARCHAR (50),
	Asyn           CHAR (1),
	StartLevel     VARCHAR (20),
	CONSTRAINT PK_FBSMARTHELP PRIMARY KEY (ID)
	)
GO
/*帮助列信息*/
Create Table If Not Exists FBSmartHelpCols
	(
	ID       VARCHAR (50) NOT NULL,
	HelpID   VARCHAR (50),
	ColName  VARCHAR (50),
	ColCode  VARCHAR (50),
	`Level`  VARCHAR (20),
	Path     VARCHAR (50),
	isDetail VARCHAR (50),
	ParentID VARCHAR (50),
	Align    CHAR (1),
	Width    VARCHAR (50),
	Format   text,
	Render   text,
	Ord      VARCHAR (50),
	Visible  CHAR (1),
	CONSTRAINT PK_FBSMARTHELPCOLS PRIMARY KEY (ID)
	)
GO


/*平台用户表*/
Create Table If Not Exists FBUserInfo(
	UID      VARCHAR (50) NOT NULL,
	UserCode VARCHAR (20),
	UserName VARCHAR (40),
	Email    VARCHAR (100),
	Telphone VARCHAR (20),
	UserPwd  VARCHAR (50),
	UserSalt VARCHAR (20),
	Note     VARCHAR (200),
	Avavtar  VARCHAR (100),
	CONSTRAINT PK_FBUserInfo PRIMARY KEY (UID)
	)
GO


/*平台日志表*/
Create Table If Not Exists FBLog(
	ID       VARCHAR (50),
	LogLevel CHAR (1),
	LogInfo  VARCHAR (1000),
	OpUser   VARCHAR (50),
	OpTime   VARCHAR (50),
	CONSTRAINT PK_FBLog PRIMARY KEY (ID)
	)
GO





/*测试表单表结构*/

Create Table If Not Exists PurCat
	(
	ID       VARCHAR (50) NOT NULL,
	CODE     VARCHAR (50),
	NAME     VARCHAR (50),
	`LEVEL`  VARCHAR (50),
	PATH     VARCHAR (50),
	PARENTID VARCHAR (50),
	ISDETAIL VARCHAR (20),
	CONSTRAINT PK_PurCat PRIMARY KEY (ID)
	)
GO


Create Table If Not Exists PurExpert
	(
	ExpertID   VARCHAR (50) NOT NULL,
	ExpertName VARCHAR (100),
	Resume     VARCHAR (4000),
	IDCard     VARCHAR (20),
	Birth      VARCHAR (20),
	Nation     VARCHAR (20),
	CONSTRAINT PK_PurExpert PRIMARY KEY (ExpertID)
	)
GO

Create Table If Not Exists PurExpertExp
	(
	ID          VARCHAR (50) NOT NULL,
	ExpertID    VARCHAR (50),
	BeginTime   VARCHAR (50),
	EndTime     VARCHAR (50),
	Description VARCHAR (50),
	UserCer     VARCHAR (50),
	CONSTRAINT PK_PurExpertExp PRIMARY KEY (ID)
	)
GO

Create Table If Not Exists PurExpertSort
	(
	ID       VARCHAR (50) NOT NULL,
	SortID   VARCHAR (50),
	ExpertID VARCHAR (50),
	CONSTRAINT PK_PurExpertSort PRIMARY KEY (ID)
	)
GO


Create Table If Not Exists ExpertSort
	(
	ID   VARCHAR (50) NOT NULL,
	Code VARCHAR (50),
	Name VARCHAR (50),
	Note VARCHAR (500),
	ORD  VARCHAR (20),
	CONSTRAINT PK_ExpertSort PRIMARY KEY  (ID)
	)
GO



CREATE TABLE If Not Exists FBComponent
	(
	ID             VARCHAR (50) NOT NULL,
	Code           VARCHAR (200),
	Name           VARCHAR (200),
	IsStatic       CHAR (1),
	AssemblyName   VARCHAR (50),
	ClassName      VARCHAR (50),
	Note           VARCHAR (200),
	CreateUser     VARCHAR (50),
	CreateTime     VARCHAR (20),
	LastModifyUser VARCHAR (20),
	LastModifyTime VARCHAR (50),
	CONSTRAINT PK_FBComponent PRIMARY KEY (ID)
	)
GO

CREATE TABLE If Not Exists FBCMPMethod
	(
	ID         VARCHAR (50) NOT NULL,
	CMPID      VARCHAR (50),
	MethodName VARCHAR (40),
	ReturnType CHAR (1),
	CONSTRAINT PK_FBCMPMethod PRIMARY KEY (ID)
	)
GO

CREATE TABLE If Not Exists FBCMPPara
	(
	ID        VARCHAR (50) NOT NULL,
	CMPID     VARCHAR (50),
	MethodID  VARCHAR (50),
	ParamName VARCHAR (50),
	ParamType CHAR (1),
	Ord       VARCHAR (50),
	Note      VARCHAR (200),
	CONSTRAINT PK_FBCMPPara PRIMARY KEY (ID)
	)
GO