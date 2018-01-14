2017-09-25 11:19:11,297 [17] ERROR FormBuilder.Service.FBDataModelService - '=' 附近有语法错误。
System.Data.SqlClient.SqlException (0x80131904): '=' 附近有语法错误。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.RunExecuteNonQueryTds(String methodName, Boolean async, Int32 timeout, Boolean asyncWrite)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DataModelCom.saveModelList(String modelID, DataSet ds, DataTable dsDel, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 387
   在 FormBuilder.Service.FBDataModelService.saveModelList(String modelID, DataSet ds, DataTable dsDel) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 594
ClientConnectionId:c7f34689-04a6-4fcc-bf6a-51e2386a10b2
Error Number:102,State:1,Class:15
2017-09-25 11:21:27,639 [27] ERROR FormBuilder.Service.FBDataModelService - '=' 附近有语法错误。
System.Data.SqlClient.SqlException (0x80131904): '=' 附近有语法错误。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.RunExecuteNonQueryTds(String methodName, Boolean async, Int32 timeout, Boolean asyncWrite)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DataModelCom.saveModelList(String modelID, DataSet ds, DataTable dsDel, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 387
   在 FormBuilder.Service.FBDataModelService.saveModelList(String modelID, DataSet ds, DataTable dsDel) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 594
ClientConnectionId:a7bc0c19-38f4-4d05-a71a-4849fe8de762
Error Number:102,State:1,Class:15
2017-09-25 11:21:51,469 [17] ERROR FormBuilder.Service.FBDataModelService - '=' 附近有语法错误。
System.Data.SqlClient.SqlException (0x80131904): '=' 附近有语法错误。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.RunExecuteNonQueryTds(String methodName, Boolean async, Int32 timeout, Boolean asyncWrite)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DataModelCom.saveModelList(String modelID, DataSet ds, DataTable dsDel, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 387
   在 FormBuilder.Service.FBDataModelService.saveModelList(String modelID, DataSet ds, DataTable dsDel) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 594
ClientConnectionId:a7bc0c19-38f4-4d05-a71a-4849fe8de762
Error Number:102,State:1,Class:15
2017-09-25 11:26:23,263 [16] ERROR FormBuilder.Service.FBDataModelService - 未将对象引用设置到对象的实例。
System.NullReferenceException: 未将对象引用设置到对象的实例。
   在 FormBuilder.Service.DataModelCom.saveModelList(String modelID, DataSet ds, DataTable dsDel, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 384
   在 FormBuilder.Service.FBDataModelService.saveModelList(String modelID, DataSet ds, DataTable dsDel) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 594
2017-09-25 11:26:54,213 [26] ERROR FormBuilder.Service.FBDataModelService - 未将对象引用设置到对象的实例。
System.NullReferenceException: 未将对象引用设置到对象的实例。
   在 FormBuilder.Service.DataModelCom.saveModelList(String modelID, DataSet ds, DataTable dsDel, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 384
   在 FormBuilder.Service.FBDataModelService.saveModelList(String modelID, DataSet ds, DataTable dsDel) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 594
2017-09-25 22:59:05,102 [3] ERROR FormBuilder.Service.FBDataModelService - 关键字 'FROM' 附近有语法错误。
System.Data.SqlClient.SqlException (0x80131904): 关键字 'FROM' 附近有语法错误。
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
   在 System.Linq.Enumerable.Single[TSource](IEnumerable`1 source)
   在 FormBuilder.Service.DMTreeHelper.getMaxPath(FBDataModelObjects objectModel, String path, String level, Boolean isSame, DataSet& ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DMTreeHelper.cs:行号 79
   在 FormBuilder.Service.DataModelCom.saveModel(String modelID, DataSet ds, String status, TreeNode treeNode, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 352
   在 FormBuilder.Service.FBDataModelService.saveModel(String modelID, DataSet ds, String status, TreeNode tree) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 563
ClientConnectionId:fce93fff-2586-4a2a-9e58-865bebe9118b
Error Number:156,State:1,Class:15
2017-09-25 23:02:42,829 [3] ERROR FormBuilder.Service.FBDataModelService - 索引和长度必须引用该字符串内的位置。
参数名: length
System.ArgumentOutOfRangeException: 索引和长度必须引用该字符串内的位置。
参数名: length
   在 System.String.Substring(Int32 startIndex, Int32 length)
   在 FormBuilder.Service.DMTreeHelper.getMaxPath(FBDataModelObjects objectModel, String path, String level, Boolean isSame, DataSet& ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DMTreeHelper.cs:行号 69
   在 FormBuilder.Service.DataModelCom.saveModel(String modelID, DataSet ds, String status, TreeNode treeNode, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 352
   在 FormBuilder.Service.FBDataModelService.saveModel(String modelID, DataSet ds, String status, TreeNode tree) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 563
2017-09-25 23:04:58,786 [3] ERROR FormBuilder.Service.FBDataModelService - 输入字符串的格式不正确。
System.FormatException: 输入字符串的格式不正确。
   在 System.Number.StringToNumber(String str, NumberStyles options, NumberBuffer& number, NumberFormatInfo info, Boolean parseDecimal)
   在 System.Number.ParseInt32(String s, NumberStyles style, NumberFormatInfo info)
   在 FormBuilder.Service.DMTreeHelper.getMaxPath(FBDataModelObjects objectModel, String path, String level, Boolean isSame, DataSet& ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DMTreeHelper.cs:行号 88
   在 FormBuilder.Service.DataModelCom.saveModel(String modelID, DataSet ds, String status, TreeNode treeNode, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 352
   在 FormBuilder.Service.FBDataModelService.saveModel(String modelID, DataSet ds, String status, TreeNode tree) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 563
2017-09-25 23:07:29,137 [3] ERROR FormBuilder.Service.FBDataModelService - 输入字符串的格式不正确。
System.FormatException: 输入字符串的格式不正确。
   在 System.Number.StringToNumber(String str, NumberStyles options, NumberBuffer& number, NumberFormatInfo info, Boolean parseDecimal)
   在 System.Number.ParseInt32(String s, NumberStyles style, NumberFormatInfo info)
   在 FormBuilder.Service.DMTreeHelper.getMaxPath(FBDataModelObjects objectModel, String path, String level, Boolean isSame, DataSet& ds) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DMTreeHelper.cs:行号 88
   在 FormBuilder.Service.DataModelCom.saveModel(String modelID, DataSet ds, String status, TreeNode treeNode, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 352
   在 FormBuilder.Service.FBDataModelService.saveModel(String modelID, DataSet ds, String status, TreeNode tree) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 563
2017-09-25 23:14:55,144 [3] ERROR FormBuilder.Service.FBDataModelService - '0' 附近有语法错误。
System.Data.SqlClient.SqlException (0x80131904): '0' 附近有语法错误。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.RunExecuteNonQueryTds(String methodName, Boolean async, Int32 timeout, Boolean asyncWrite)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DMTreeHelper.updateMXField(FBDataModelObjects objectModel, TreeNode tree) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DMTreeHelper.cs:行号 103
   在 FormBuilder.Service.DataModelCom.saveModel(String modelID, DataSet ds, String status, TreeNode treeNode, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 355
   在 FormBuilder.Service.FBDataModelService.saveModel(String modelID, DataSet ds, String status, TreeNode tree) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 563
ClientConnectionId:864ca19f-5c22-4d17-922d-2d1e1cfda42d
Error Number:102,State:1,Class:15
2017-09-25 23:15:05,364 [3] ERROR FormBuilder.Service.FBDataModelService - '0' 附近有语法错误。
System.Data.SqlClient.SqlException (0x80131904): '0' 附近有语法错误。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.RunExecuteNonQueryTds(String methodName, Boolean async, Int32 timeout, Boolean asyncWrite)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DMTreeHelper.updateMXField(FBDataModelObjects objectModel, TreeNode tree) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DMTreeHelper.cs:行号 103
   在 FormBuilder.Service.DataModelCom.saveModel(String modelID, DataSet ds, String status, TreeNode treeNode, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 355
   在 FormBuilder.Service.FBDataModelService.saveModel(String modelID, DataSet ds, String status, TreeNode tree) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 563
ClientConnectionId:864ca19f-5c22-4d17-922d-2d1e1cfda42d
Error Number:102,State:1,Class:15
2017-09-25 23:15:15,046 [13] ERROR FormBuilder.Service.FBDataModelService - '0' 附近有语法错误。
System.Data.SqlClient.SqlException (0x80131904): '0' 附近有语法错误。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.RunExecuteNonQueryTds(String methodName, Boolean async, Int32 timeout, Boolean asyncWrite)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DMTreeHelper.updateMXField(FBDataModelObjects objectModel, TreeNode tree) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DMTreeHelper.cs:行号 103
   在 FormBuilder.Service.DataModelCom.saveModel(String modelID, DataSet ds, String status, TreeNode treeNode, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 355
   在 FormBuilder.Service.FBDataModelService.saveModel(String modelID, DataSet ds, String status, TreeNode tree) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 563
ClientConnectionId:864ca19f-5c22-4d17-922d-2d1e1cfda42d
Error Number:102,State:1,Class:15
2017-09-25 23:16:09,363 [3] ERROR FormBuilder.Service.FBDataModelService - '0' 附近有语法错误。
System.Data.SqlClient.SqlException (0x80131904): '0' 附近有语法错误。
   在 System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)
   在 System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)
   在 System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)
   在 System.Data.SqlClient.SqlCommand.RunExecuteNonQueryTds(String methodName, Boolean async, Int32 timeout, Boolean asyncWrite)
   在 System.Data.SqlClient.SqlCommand.InternalExecuteNonQuery(TaskCompletionSource`1 completion, String methodName, Boolean sendToPipe, Int32 timeout, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)
   在 System.Data.SqlClient.SqlCommand.ExecuteNonQuery()
   在 NPoco.Database.ExecuteNonQueryHelper(DbCommand cmd)
   在 NPoco.Database.Execute(Sql Sql)
   在 FormBuilder.Service.DMTreeHelper.updateMXField(FBDataModelObjects objectModel, TreeNode tree) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DMTreeHelper.cs:行号 103
   在 FormBuilder.Service.DataModelCom.saveModel(String modelID, DataSet ds, String status, TreeNode treeNode, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 355
   在 FormBuilder.Service.FBDataModelService.saveModel(String modelID, DataSet ds, String status, TreeNode tree) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 563
ClientConnectionId:864ca19f-5c22-4d17-922d-2d1e1cfda42d
Error Number:102,State:1,Class:15
