2017-11-23 16:51:53,101 [7] ERROR FormBuilder.Service.FBDataModelService - Table 'aframework2.fbmodelsql' doesn't exist
MySql.Data.MySqlClient.MySqlException (0x80004005): Table 'aframework2.fbmodelsql' doesn't exist
   在 MySql.Data.MySqlClient.MySqlStream.ReadPacket()
   在 MySql.Data.MySqlClient.NativeDriver.GetResult(Int32& affectedRow, Int64& insertedId)
   在 MySql.Data.MySqlClient.Driver.NextResult(Int32 statementId, Boolean force)
   在 MySql.Data.MySqlClient.MySqlDataReader.NextResult()
   在 MySql.Data.MySqlClient.MySqlCommand.ExecuteReader(CommandBehavior behavior)
   在 NPoco.Database.ExecuteReaderHelper(DbCommand cmd)
   在 NPoco.Database.ExecuteDataReader(DbCommand cmd)
   在 NPoco.Database.<QueryImp>d__156`1.MoveNext()
   在 System.Collections.Generic.List`1..ctor(IEnumerable`1 collection)
   在 System.Linq.Enumerable.ToList[TSource](IEnumerable`1 source)
   在 FormBuilder.Service.DMSQL.getModelSQLlist(String modelID) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DMSQL.cs:行号 31
   在 FormBuilder.Service.DMSQL..ctor(String modelID, Database db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DMSQL.cs:行号 27
   在 FormBuilder.Service.DataModelCom.saveModelALL(String modelID, FBDataModel model, String dataID, DataSet ds, String status, Database Db) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\DM.Com\DataModelCom.cs:行号 638
   在 FormBuilder.Service.FBDataModelService.saveModelALL(String modelID, String dataID, DataSet ds, String status) 位置 F:\Project\FormBuilder\Com.FormBuilder\FromBuilder.Service\FBDataModelService.cs:行号 795
