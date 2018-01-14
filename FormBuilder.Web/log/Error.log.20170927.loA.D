2017-09-27 14:56:03,877 [25] ERROR FormBuilder.Service.FBDataModelService - 违反了 PRIMARY KEY 约束 'PK_PurExpert'。不能在对象 'dbo.PurExpert' 中插入重复键。
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
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 400
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
ClientConnectionId:d0c93d04-23b3-45ac-982e-c8548ecb1347
Error Number:2627,State:1,Class:14
2017-09-27 21:26:00,551 [3] ERROR FormBuilder.Service.FBDataModelService - 违反了 PRIMARY KEY 约束 'PK_PurExpert'。不能在对象 'dbo.PurExpert' 中插入重复键。
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
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 400
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
ClientConnectionId:1e111e8d-f8d3-41e4-9044-72147362bb54
Error Number:2627,State:1,Class:14
2017-09-27 21:26:13,834 [7] ERROR FormBuilder.Service.FBDataModelService - 违反了 PRIMARY KEY 约束 'PK_PurExpert'。不能在对象 'dbo.PurExpert' 中插入重复键。
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
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 400
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
ClientConnectionId:1e111e8d-f8d3-41e4-9044-72147362bb54
Error Number:2627,State:1,Class:14
2017-09-27 23:01:00,362 [19] ERROR FormBuilder.Service.FBDataModelService - 在位置 0 处没有任何行。
System.IndexOutOfRangeException: 在位置 0 处没有任何行。
   在 System.Data.RBTree`1.GetNodeByIndex(Int32 userIndex)
   在 System.Data.DataRowCollection.get_Item(Int32 index)
   在 FormBuilder.Service.DataModelEngine.BuildUpdateSql(FBDataModelObjects obj, DataSet ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelEngine.cs:行号 169
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 396
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
2017-09-27 23:04:11,448 [30] ERROR FormBuilder.Service.FBDataModelService - 在位置 0 处没有任何行。
System.IndexOutOfRangeException: 在位置 0 处没有任何行。
   在 System.Data.RBTree`1.GetNodeByIndex(Int32 userIndex)
   在 System.Data.DataRowCollection.get_Item(Int32 index)
   在 FormBuilder.Service.DataModelEngine.BuildUpdateSql(FBDataModelObjects obj, DataSet ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelEngine.cs:行号 169
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 396
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
2017-09-27 23:05:20,390 [32] ERROR FormBuilder.Service.FBDataModelService - 在位置 0 处没有任何行。
System.IndexOutOfRangeException: 在位置 0 处没有任何行。
   在 System.Data.RBTree`1.GetNodeByIndex(Int32 userIndex)
   在 System.Data.DataRowCollection.get_Item(Int32 index)
   在 FormBuilder.Service.DataModelEngine.BuildUpdateSql(FBDataModelObjects obj, DataSet ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelEngine.cs:行号 169
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 396
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
2017-09-27 23:52:49,058 [3] ERROR FormBuilder.Service.FBDataModelService - 违反了 PRIMARY KEY 约束 'PK_PurExpert'。不能在对象 'dbo.PurExpert' 中插入重复键。
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
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 400
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 580
ClientConnectionId:98007a9f-debd-4fcb-a098-b4304489c6d5
Error Number:2627,State:1,Class:14
