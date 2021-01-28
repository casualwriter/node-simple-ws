### Introduction

[node-simple-ws](https://github.com/casualwriter/node-simple-ws) is simple web-service program for general data retrieval.

* Single js file in about 60 lines code.
* Self-contained, no depandence 
* Portable, no installation needed
* Simple SQL definition for general purpose
* Connect via OLE DB driver for Oracle, MSSQL, MS Access, MySql, ODBC, etc..  


### Installation & First Run

The program is portable. 

1. simple download ``node-simple-ws-v1.zip`` (it include node.exe, node-adodb, and simple-ws.js), 
2. unzip it to a folder
3. ``node.exe simple-ws`` to start the web service

A sample web service will be started at port 9000, and the following links are available

~~~
 http://localhost:9000/Categories
 http://localhost:9000/Customers
 http://localhost:9000/Product?key=hot
 http://localhost:9000/Order?customer=Essen&country=Germany   
~~~


### Coding for your web service

The program is very simple in about 60 lines. You may read and modify the code.

or just edit ``simple-ws.js`` for DB-CONNECTION and WEB-SERVICE-DEFINITION like below

~~~
//=== Connect to datbase via OLEDB, e.g. MS Access 2003 (sample.mdb)
var connection = ADODB.open( 'Provider=Microsoft.ACE.OLEDB.12.0;Data Source=sample.mdb;' )


//======================== WS Definition ========================
var wsd = { name:'Webservice Definition' }

// http://localhost:9000/Categories
wsd.Categories = `select * from Categories`;

// http://localhost:9000/Customers
wsd.Customers	= `select * from Customers `;

// e.g. http://localhost:9000/Product?key=hot
wsd.Product	= `select * from Products where ProductName like '%{key}%' `;

// e.g. http://localhost:9000/Order?customer=Essen&country=Germany
wsd.Order	= `select a.* from Orders a, Customers b 
              where a.CustomerID=b.CustomerID 
                and b.CompanyName like '%{customer}%' 
                and ShipCountry like '%{country}%' 
            `;

~~~


