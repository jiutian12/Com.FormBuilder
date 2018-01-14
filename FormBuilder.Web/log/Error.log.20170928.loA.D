2017-09-28 11:09:37,628 [15] ERROR FormBuilder.Service.FBDataModelService - 违反了 PRIMARY KEY 约束 'PK_PurExpert'。不能在对象 'dbo.PurExpert' 中插入重复键。
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
ClientConnectionId:466ed8bc-ad41-47c7-9b3b-b03e2079da96
Error Number:2627,State:1,Class:14
2017-09-28 21:17:11,972 [43] ERROR FormBuilder.Service.FBDataModelService - 违反了 PRIMARY KEY 约束 'PK_PurExpert'。不能在对象 'dbo.PurExpert' 中插入重复键。
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
ClientConnectionId:9b904d6e-5428-43d1-955d-43cbb1582f94
Error Number:2627,State:1,Class:14
2017-09-28 21:26:30,605 [45] ERROR FormBuilder.Service.FBDataModelService - 违反了 PRIMARY KEY 约束 'PK_PurExpert'。不能在对象 'dbo.PurExpert' 中插入重复键。
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
ClientConnectionId:9b904d6e-5428-43d1-955d-43cbb1582f94
Error Number:2627,State:1,Class:14
