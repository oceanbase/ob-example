# Guide Connecting SpringJDBC to OceanBase
English | [简体中文](README-CN.md)

This document introduces how to connect to the OceanBase database through SpringJDBC.
Since OceanBase supports MySQL mode and Oracle mode, you can use the MySQL driver to connect to OceanBase.

## Quick Start

1. add the MySQL driver dependency to the pom.xml file, referring to the [OceanBase Spring JDBC connection example](https://www.oceanbase.com/docs/community-observer-cn-10000000000900916).

```xml
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-jdbc</artifactId>
      <version>5.0.9.RELEASE</version>
    </dependency>
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>8.0.25</version>
    </dependency>
    <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>druid</artifactId>
      <version>1.2.18</version>
    </dependency>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.13.2</version>
      <scope>test</scope>
    </dependency>
```

2. Create a new test class and instantiate JdbcTemplate using the Druid connection pool.

```java
public class OceanBaseSpringJdbcApplicationTest {
  private static JdbcTemplate jdbcTemplate;
  private String sql;

  static {
    Map<String, String> map = new HashMap<String, String>();
    map.put("url", "jdbc:mysql://localhost:2881/test");
    map.put("driverClassName", "com.mysql.cj.jdbc.Driver");
    map.put("username", "root@test");
    map.put("password", "");
    try {
      Class.forName(map.get("driverClassName"));
      jdbcTemplate = new JdbcTemplate(DruidDataSourceFactory.createDataSource(map));
      //防止异常语句,没有这两句，会出错(Prevent abnormal statements, without which errors will occur)
      jdbcTemplate.execute("set transaction_isolation = 'READ-COMMITTED';"); // MySQL 8.0 之后，系统变量 tx_isolation 被更改为 transaction_isolation (After MySQL 8.0, the system variable tx_isolation was changed to transaction_isolation)
      // jdbcTemplate.execute("set tx_isolation = 'READ-COMMITTED';"); // MySQL 8.0 之前的版本使用 tx_isolation (tx_isolation is used in versions before MySQL 8.0)
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
```

3. Write any tests method to execute the SQL statement.

```java
// MySQL Type Create Table
@Test
public void createByMySQLTypeDate(){
  // MySQL Create Table
  sql ="CREATE TABLE D_DPRECORD(DEV_ID VARCHAR(50),"+
    "CAR_SPEED INT(3),"+
    "CAP_DATE TIMESTAMP," +
    "DEV_CHNID VARCHAR(50) not null," +
    "TRSFMARK INT(1) DEFAULT 0," +
    "CREATE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
    ");";
  jdbcTemplate.execute(sql);
}

// Oracle Type Create
@Test
public void createByOrcTypeDate(){
  // Oracle Create Table
  sql ="CREATE TABLE D_DPRECORD(DEV_ID VARCHAR2(50),"+
    "CAR_SPEED NUMBER(3),"+
    "CAP_DATE TIMESTAMP WITH LOCAL TIME ZONE," +
    "DEV_CHNID VARCHAR2(50) NOT NULL," +
    "TRSFMARK NUMBER(1) DEFAULT 0," +
    "CREATE_TIME DATE DEFAULT sysdate" +
    ");";

  jdbcTemplate.execute(sql);
}

// MySQL/Oracle Type Add Test Data
@Test
public void addTest(){
  int i = 1;
  for (;i<=100;i++){
    sql = "INSERT INTO D_DPRECORD VALUES " +
      "('DEV_ID"+i+"',"+i+",'2021-01-01 00:00:00','DEV_CHNID"+i+"',"+i+",'2021-01-01 00:00:00');";
    jdbcTemplate.execute(sql);
  }
}

// MySQL/Oracle Type Query Test Data
@Test
public void queryTest(){
  sql = "SELECT * FROM D_DPRECORD;";
  jdbcTemplate.queryForList(sql).forEach(System.out::println);
}

// MySQL/Oracle Type Update Test Data
@Test
public void updateTest(){
  sql = "UPDATE D_DPRECORD SET CAR_SPEED = 100 WHERE DEV_ID = 'DEV_ID1';";
  jdbcTemplate.execute(sql);
}

// MySQL/Oracle Type Delete Test Data
@Test
public void deleteTest(){
  sql = "DELETE FROM D_DPRECORD WHERE DEV_ID = 'DEV_ID1';";
  jdbcTemplate.execute(sql);
}

// MySQL/Oracle Type Drop Table
@Test
public void dropTable(){
  sql = "DROP TABLE D_DPRECORD;";
  jdbcTemplate.execute(sql);
}
```

Modify the connection info in code, and use `run.sh` to run the example code.

```bash
sh run.sh
```