2017-09-29 15:32:22,561 [29] ERROR FormBuilder.Web.Controllers.DataModelController - System.Data.SqlClient.SqlException (0x80131904): 关键字 'from' 附近有语法错误。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlDataReader.TryConsumeMetaData()
   在 System.Data.SqlClient.SqlDataReader.get_MetaData()
   在 System.Data.SqlClient.SqlCommand.FinishExecuteReader(SqlDataReader ds, RunBehavior runBehavior, String resetOptionsString, Boolean isInternal, Boolean forDescribeParameterEncryption)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReaderTds(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, Boolean async, Int32 timeout, Task& task, Boolean asyncWrite, Boolean inRetry, SqlDataReader ds, Boolean describeParameterEncryptionRequest)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method, TaskCompletionSource`1 completion, Int32 timeout, Task& task, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method)
   在 System.Data.SqlClient.SqlCommand.ExecuteReader(CommandBehavior behavior, String method)
   在 NPoco.Database.ExecuteReaderHelper(DbCommand cmd)
   在 NPoco.Database.ExecuteDataReader(DbCommand cmd)
   在 NPoco.Database.<QueryImp>d__156`1.MoveNext()
   在 System.Collections.Generic.List`1..ctor(IEnumerable`1 collection)
   在 System.Linq.Enumerable.ToList[TSource](IEnumerable`1 source)
   在 FormBuilder.Service.FBFileService.getFileList(String dataID, String frmID, String field) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBFileService.cs:行号 41
   在 FormBuilder.Web.Controllers.FileController.GetFileList(String dataID, String frmID, String field) 位置 F:\Project\FormBuilder\Com.FormBuilder\FormBuilder.Web\Controllers\FileController.cs:行号 69
ClientConnectionId:4f62d2b9-853c-4454-8a58-a334e2d1a062
Error Number:156,State:1,Class:15
2017-09-29 15:32:55,718 [28] ERROR FormBuilder.Web.Controllers.DataModelController - System.Data.SqlClient.SqlException (0x80131904): 关键字 'from' 附近有语法错误。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlDataReader.TryConsumeMetaData()
   在 System.Data.SqlClient.SqlDataReader.get_MetaData()
   在 System.Data.SqlClient.SqlCommand.FinishExecuteReader(SqlDataReader ds, RunBehavior runBehavior, String resetOptionsString, Boolean isInternal, Boolean forDescribeParameterEncryption)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReaderTds(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, Boolean async, Int32 timeout, Task& task, Boolean asyncWrite, Boolean inRetry, SqlDataReader ds, Boolean describeParameterEncryptionRequest)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method, TaskCompletionSource`1 completion, Int32 timeout, Task& task, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method)
   在 System.Data.SqlClient.SqlCommand.ExecuteReader(CommandBehavior behavior, String method)
   在 NPoco.Database.ExecuteReaderHelper(DbCommand cmd)
   在 NPoco.Database.ExecuteDataReader(DbCommand cmd)
   在 NPoco.Database.<QueryImp>d__156`1.MoveNext()
   在 System.Collections.Generic.List`1..ctor(IEnumerable`1 collection)
   在 System.Linq.Enumerable.ToList[TSource](IEnumerable`1 source)
   在 FormBuilder.Service.FBFileService.getFileList(String dataID, String frmID, String field) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBFileService.cs:行号 41
   在 FormBuilder.Web.Controllers.FileController.GetFileList(String dataID, String frmID, String field) 位置 F:\Project\FormBuilder\Com.FormBuilder\FormBuilder.Web\Controllers\FileController.cs:行号 69
ClientConnectionId:4f62d2b9-853c-4454-8a58-a334e2d1a062
Error Number:156,State:1,Class:15
2017-09-29 17:27:07,433 [27] ERROR FormBuilder.Service.FBDataModelService - 在位置 0 处没有任何行。
System.IndexOutOfRangeException: 在位置 0 处没有任何行。
   在 System.Data.RBTree`1.GetNodeByIndex(Int32 userIndex)
   在 System.Data.DataRowCollection.get_Item(Int32 index)
   在 FormBuilder.Service.DataModelEngine.BuildUpdateSql(FBDataModelObjects obj, DataSet ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelEngine.cs:行号 169
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 398
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
2017-09-29 17:27:14,988 [68] ERROR FormBuilder.Service.FBDataModelService - 在位置 0 处没有任何行。
System.IndexOutOfRangeException: 在位置 0 处没有任何行。
   在 System.Data.RBTree`1.GetNodeByIndex(Int32 userIndex)
   在 System.Data.DataRowCollection.get_Item(Int32 index)
   在 FormBuilder.Service.DataModelEngine.BuildUpdateSql(FBDataModelObjects obj, DataSet ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelEngine.cs:行号 169
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 398
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
2017-09-29 17:29:13,045 [63] ERROR FormBuilder.Service.FBDataModelService - 在位置 0 处没有任何行。
System.IndexOutOfRangeException: 在位置 0 处没有任何行。
   在 System.Data.RBTree`1.GetNodeByIndex(Int32 userIndex)
   在 System.Data.DataRowCollection.get_Item(Int32 index)
   在 FormBuilder.Service.DataModelEngine.BuildUpdateSql(FBDataModelObjects obj, DataSet ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelEngine.cs:行号 169
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 398
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
2017-09-29 17:30:09,442 [58] ERROR FormBuilder.Service.FBDataModelService - 在位置 0 处没有任何行。
System.IndexOutOfRangeException: 在位置 0 处没有任何行。
   在 System.Data.RBTree`1.GetNodeByIndex(Int32 userIndex)
   在 System.Data.DataRowCollection.get_Item(Int32 index)
   在 FormBuilder.Service.DataModelEngine.BuildUpdateSql(FBDataModelObjects obj, DataSet ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelEngine.cs:行号 169
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 398
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
2017-09-29 17:30:16,294 [27] ERROR FormBuilder.Service.FBDataModelService - 在位置 0 处没有任何行。
System.IndexOutOfRangeException: 在位置 0 处没有任何行。
   在 System.Data.RBTree`1.GetNodeByIndex(Int32 userIndex)
   在 System.Data.DataRowCollection.get_Item(Int32 index)
   在 FormBuilder.Service.DataModelEngine.BuildUpdateSql(FBDataModelObjects obj, DataSet ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelEngine.cs:行号 169
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 398
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
2017-09-29 17:30:31,943 [58] ERROR FormBuilder.Service.FBDataModelService - 在位置 0 处没有任何行。
System.IndexOutOfRangeException: 在位置 0 处没有任何行。
   在 System.Data.RBTree`1.GetNodeByIndex(Int32 userIndex)
   在 System.Data.DataRowCollection.get_Item(Int32 index)
   在 FormBuilder.Service.DataModelEngine.BuildUpdateSql(FBDataModelObjects obj, DataSet ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelEngine.cs:行号 169
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 398
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
2017-09-29 17:31:38,532 [58] ERROR FormBuilder.Service.FBDataModelService - 在位置 0 处没有任何行。
System.IndexOutOfRangeException: 在位置 0 处没有任何行。
   在 System.Data.RBTree`1.GetNodeByIndex(Int32 userIndex)
   在 System.Data.DataRowCollection.get_Item(Int32 index)
   在 FormBuilder.Service.DataModelEngine.BuildUpdateSql(FBDataModelObjects obj, DataSet ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelEngine.cs:行号 169
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 398
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
2017-09-29 17:31:58,535 [27] ERROR FormBuilder.Service.FBDataModelService - 在位置 0 处没有任何行。
System.IndexOutOfRangeException: 在位置 0 处没有任何行。
   在 System.Data.RBTree`1.GetNodeByIndex(Int32 userIndex)
   在 System.Data.DataRowCollection.get_Item(Int32 index)
   在 FormBuilder.Service.DataModelEngine.BuildUpdateSql(FBDataModelObjects obj, DataSet ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelEngine.cs:行号 169
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 398
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
2017-09-29 17:31:58,563 [72] ERROR FormBuilder.Service.FBDataModelService - 在位置 0 处没有任何行。
System.IndexOutOfRangeException: 在位置 0 处没有任何行。
   在 System.Data.RBTree`1.GetNodeByIndex(Int32 userIndex)
   在 System.Data.DataRowCollection.get_Item(Int32 index)
   在 FormBuilder.Service.DataModelEngine.BuildUpdateSql(FBDataModelObjects obj, DataSet ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelEngine.cs:行号 169
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 398
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
2017-09-29 21:12:41,553 [8] ERROR FormBuilder.Service.FBDataModelService - 违反了 PRIMARY KEY 约束 'PK_PurExpert'。不能在对象 'dbo.PurExpert' 中插入重复键。
语句已终止。
System.Data.SqlClient.SqlException (0x80131904): 违反了 PRIMARY KEY 约束 'PK_PurExpert'。不能在对象 'dbo.PurExpert' 中插入重复键。
语句已终止。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.FinishExecuteReader(SqlDataReader ds, RunBehavior runBehavior, String resetOptionsString, Boolean isInternal, Boolean forDescribeParameterEncryption)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReaderTds(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, Boolean async, Int32 timeout, Task& task, Boolean asyncWrite, Boolean inRetry, SqlDataReader ds, Boolean describeParameterEncryptionRequest)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method, TaskCompletionSource`1 completion, Int32 timeout, Task& task, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 402
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
ClientConnectionId:fa07987e-bbfc-4c49-b12e-5d8b987d41fa
Error Number:2627,State:1,Class:14
2017-09-29 21:12:52,369 [9] ERROR FormBuilder.Service.FBDataModelService - 违反了 PRIMARY KEY 约束 'PK_PurExpert'。不能在对象 'dbo.PurExpert' 中插入重复键。
语句已终止。
System.Data.SqlClient.SqlException (0x80131904): 违反了 PRIMARY KEY 约束 'PK_PurExpert'。不能在对象 'dbo.PurExpert' 中插入重复键。
语句已终止。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.FinishExecuteReader(SqlDataReader ds, RunBehavior runBehavior, String resetOptionsString, Boolean isInternal, Boolean forDescribeParameterEncryption)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReaderTds(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, Boolean async, Int32 timeout, Task& task, Boolean asyncWrite, Boolean inRetry, SqlDataReader ds, Boolean describeParameterEncryptionRequest)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method, TaskCompletionSource`1 completion, Int32 timeout, Task& task, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 402
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
ClientConnectionId:fa07987e-bbfc-4c49-b12e-5d8b987d41fa
Error Number:2627,State:1,Class:14
2017-09-29 22:26:17,659 [61] ERROR FormBuilder.Service.FBDataModelService - 违反了 PRIMARY KEY 约束 'PK_PurExpert'。不能在对象 'dbo.PurExpert' 中插入重复键。
语句已终止。
System.Data.SqlClient.SqlException (0x80131904): 违反了 PRIMARY KEY 约束 'PK_PurExpert'。不能在对象 'dbo.PurExpert' 中插入重复键。
语句已终止。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.FinishExecuteReader(SqlDataReader ds, RunBehavior runBehavior, String resetOptionsString, Boolean isInternal, Boolean forDescribeParameterEncryption)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReaderTds(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, Boolean async, Int32 timeout, Task& task, Boolean asyncWrite, Boolean inRetry, SqlDataReader ds, Boolean describeParameterEncryptionRequest)
   在 System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method, TaskCompletionSource`1 completion, Int32 timeout, Task& task, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 402
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
ClientConnectionId:62e5311c-14c8-4212-822c-65e55fa66b6b
Error Number:2627,State:1,Class:14
