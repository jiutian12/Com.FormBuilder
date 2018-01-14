using NPoco;

namespace FormBuilder.DataAccess.Interface
{
   public interface IDbContext
    {
        Database Db { get; }
        void Dispose();
    }
}
