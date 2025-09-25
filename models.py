from django.db import models

# Create your models here.
# All Codes to be Non-Editable, all mandatory fields should have '*'
class CompanyMaster(models.Model):
    Company_ID=models.BigAutoField(primary_key=True)
    Company_Code=models.CharField(max_length=15,unique=True)
    Company_Name=models.CharField(max_length=50)
    GSTIN=models.CharField(max_length=15)
    Active=models.BooleanField(default=True)
    Address=models.CharField(max_length=255,blank=True)
    Contact=models.CharField(max_length=30,blank=True)

    def __str__(self):
        return self.Company_Code

class YearMaster(models.Model):
    Year_ID=models.BigAutoField(primary_key=True)
    Year_Code=models.CharField(max_length=10,unique=True)
    Start_Date=models.DateField(auto_now=True)
    End_Date=models.DateField(auto_now=True)
    active=models.BooleanField(default=False)

    def __str__(self):
        return self.Year_Code

class UserMaster(models.Model):
    User_ID=models.BigAutoField(primary_key=True)
    User_Name=models.CharField(max_length=255)
    Contact=models.CharField(max_length=30)
    Password=models.CharField(max_length=8)
    TYPE_A='S'
    TYPE_B='A'
    TYPE_C='U'
    USER_CHOICES=[
        (TYPE_A,'SuperUser'),
        (TYPE_B,'Admin'),
        (TYPE_C,'User'),
    ]
    UType=models.CharField(max_length=1,choices=USER_CHOICES)
    active=models.BooleanField(default=True)

    def __str__(self):
        return self.User_Name

# All fields are mandatory:
class UnitMaster(models.Model):
    Unit_ID=models.BigAutoField(primary_key=True)
    Unit_Code=models.CharField(max_length=6,unique=True)
    Description=models.CharField(max_length=15)
    Conversion=models.DecimalField(max_digits=10,decimal_places=3)

    def __str__(self):
        return self.Unit_Code

class StoneMaster(models.Model):
    ID=models.BigAutoField(primary_key=True)
    Code=models.CharField(max_length=6,unique=True)
    Description=models.CharField(max_length=15)
    ID_master=models.ForeignKey(UnitMaster,on_delete=models.PROTECT)
    def __str__(self):
        return self.Code



class StoneSubMaster(models.Model):
    Sub_ID=models.BigAutoField(primary_key=True)
    Sub_Code=models.CharField(max_length=6,unique=True)
    Description=models.CharField(max_length=15)
    Pcs=models.IntegerField()
    Weight=models.DecimalField(max_digits=6,decimal_places=3)
    ID_Group=models.ForeignKey(StoneMaster,on_delete=models.PROTECT)
    # Show only
    Unit=models.ForeignKey(UnitMaster,editable=False,on_delete=models.PROTECT)

    def __str__(self):
        return self.Sub_Code

# Done
class ColorMaster(models.Model):
    ID=models.BigAutoField(primary_key=True)
    Code=models.CharField(max_length=6,unique=True)
    Description=models.CharField(max_length=15)

    def __str__(self):
        return self.Code

class PlatingMaster(models.Model):
    ID=models.BigAutoField(primary_key=True)
    Code=models.CharField(max_length=6,unique=True)
    Description=models.CharField(max_length=15)

    def __str__(self):
        return self.Code

# Doubt: amount(float-<6.2>) *********************************************************************
class MiscChargeMaster(models.Model):
    ID=models.BigAutoField(primary_key=True)
    Code=models.CharField(max_length=6,unique=True)
    Description=models.CharField(max_length=15)

    def __str__(self):
        return self.Code

class PlatingPolishMaster(models.Model):
    Polish_ID=models.BigAutoField(primary_key=True)
    Polish_Code=models.CharField(max_length=6,unique=True)
    Description=models.CharField(max_length=15)
    Rate=models.DecimalField(max_digits=8,decimal_places=2)

    def __str__(self):
        return self.Polish_Code

class ItemMaster(models.Model):
    ID=models.BigAutoField(primary_key=True)
    Code=models.CharField(max_length=6,unique=True)
    Description=models.CharField(max_length=15)

    def __str__(self):
        return self.Code

# Doubt: About the structure...No System ID*********************************************
class SystemMaster(models.Model):
    ID=models.BigAutoField(primary_key=True)
    TYPE_A='P'
    TYPE_B='B'
    TYPE_C='A'
    TYPE_D='M'
    TYPE_E='S'
    TYPE_F='O'
    METAL_CHOICES=[
        (TYPE_A,'Pure'),
        (TYPE_B,'Brass'),
        (TYPE_C,'Alloy'),
        (TYPE_D,'Model'),
        (TYPE_E,'Scrap'),
        (TYPE_F,'Others'),
    ]
    Metal_Type=models.CharField(max_length=1,choices=METAL_CHOICES)
    System_Name = models.CharField(max_length=255,default='Default System')  #fixed
    Company_Name=models.ForeignKey(CompanyMaster,on_delete=models.PROTECT)
    def __str__(self):
        return self.System_Name

# All are mandatory except “Tolerance Limit” 
class RawMaterialMaster(models.Model):
    Raw_ID=models.BigAutoField(primary_key=True)
    Raw_Code=models.CharField(max_length=6,unique=True)
    Raw_Description=models.CharField(max_length=15)
    Tolerance_Lower=models.DecimalField(max_digits=6,decimal_places=3,null=True,blank=True)
    Tolerance_Upper=models.DecimalField(max_digits=6,decimal_places=3,null=True,blank=True)
    Metal_Type=models.ForeignKey(SystemMaster,on_delete=models.PROTECT)
    def __str__(self):
        return self.Raw_Code
    
    
class DesignGroupMaster(models.Model):
    ID=models.BigAutoField(primary_key=True)
    Code=models.CharField(max_length=6,unique=True)
    Description=models.CharField(max_length=15)

    def __str__(self):
        return self.Code

# Header: All are mandatory except “Ref Code”, ”Tolerance Limit”
# Detail: Before Item there has “Srl” column. If “Item” OR “Stone Main” OR “Stone Sub”   
#         exists then whole line mandatory rather line must not be saved.                        
# “Srl” column NE auto increase. 
class DesignMaster(models.Model):
    DesignID=models.BigAutoField(primary_key=True)
    Design_Code=models.CharField(max_length=15,unique=True)
    Ref_Code=models.CharField(max_length=15,null=True,blank=True,unique=True)
    Design_Description=models.CharField(max_length=30)
    Design_Group=models.ForeignKey(DesignGroupMaster,on_delete=models.PROTECT)
    ID_master=models.ForeignKey(ItemMaster,on_delete=models.PROTECT)
    Picture=models.CharField(max_length=255)
    # Check Pic Path Field in Dj
    Gross_Weight=models.DecimalField(max_digits=9,decimal_places=3)
    Tolerance_Lower=models.DecimalField(max_digits=6,decimal_places=3,null=True,blank=True)
    Tolerance_Upper=models.DecimalField(max_digits=6,decimal_places=3,null=True,blank=True)
    
    def __str__(self):
        return self.Design_Code

class Opening_Artisan_RawMaterial(models.Model):
    ID=models.BigAutoField(primary_key=True)
    ID_Artisan= models.ForeignKey('ArtisanMaster',on_delete=models.PROTECT)
    Srl_Col= models.IntegerField()
    ID_Metal= models.ForeignKey(RawMaterialMaster,on_delete=models.PROTECT)
    Qty=models.DecimalField(max_digits=10,decimal_places=3)
    TYPE_CREDIT = 'C'
    TYPE_DEBIT = 'D'
    CRDR_CHOICES = [
        (TYPE_CREDIT, 'Credit'),
        (TYPE_DEBIT, 'Debit'),
    ]

    Cr_Dr = models.CharField(
        max_length=1,
        choices=CRDR_CHOICES,
        default=TYPE_DEBIT,  # 👈 Default to avoid migration errors
        null=False,
        blank=False
    )
    # Metal [Cr/Dr]:

    def __str__(self):
        return self.ID

class Opening_Raw_Material(models.Model):
    ID=models.BigAutoField(primary_key=True)
    Srl_Col=models.IntegerField()
    ID_Department=models.ForeignKey('DepartmentMaster',on_delete=models.PROTECT)
    ID_Metal=models.ForeignKey(RawMaterialMaster,on_delete=models.PROTECT)
    Qty=models.DecimalField(max_digits=10,decimal_places=3)

    def __str__(self):
        return self.ID

class Opening_Design_Stock(models.Model):
    ID=models.BigAutoField(primary_key=True)
    Srl_Col=models.IntegerField()
    ID_Dept=models.ForeignKey('DepartmentMaster',on_delete=models.PROTECT)
    ID_Process=models.ForeignKey('ProcessMaster',on_delete=models.PROTECT)
    ID_Design=models.ForeignKey(DesignMaster,on_delete=models.PROTECT)
    ID_Item=models.ForeignKey(ItemMaster,on_delete=models.PROTECT,null=True,blank=True)
    Pcs=models.IntegerField()
    Weight=models.DecimalField(max_digits=10,decimal_places=3,editable=False)

    def __str__(self):
        return self.ID

class Opening_Design_Stock_Stone(models.Model):
    ID=models.BigAutoField(primary_key=True)
    ID_Header=models.ForeignKey(Opening_Design_Stock,on_delete=models.PROTECT)
    Srl_Col=models.IntegerField()
    ID_Item=models.ForeignKey(ItemMaster,on_delete=models.PROTECT,null=True,blank=True)
    ID_StoneM=models.ForeignKey(StoneMaster,on_delete=models.PROTECT)
    ID_StoneS=models.ForeignKey(StoneSubMaster,on_delete=models.PROTECT)
    ID_Color=models.ForeignKey(ColorMaster,on_delete=models.PROTECT)
    Pcs=models.IntegerField()
    Weight=models.DecimalField(max_digits=10,decimal_places=3,editable=False)

    def __str__(self):
        return self.ID


class ProcessMaster(models.Model):
    Process_ID=models.BigAutoField(primary_key=True)
    Process_Code=models.CharField(max_length=15,unique=True)
    Description=models.CharField(max_length=30)
    Process_Serial = models.IntegerField(default=0)
    Execution_Days=models.IntegerField()
    Design_Stock_Effect=models.BooleanField(default=False)

    def __str__(self):
        return self.Process_Code
    

class DepartmentMaster(models.Model):
    ID=models.BigAutoField(primary_key=True)
    Code=models.CharField(max_length=6,unique=True)
    Description=models.CharField(max_length=15)
    ID_master=models.ForeignKey(ProcessMaster,on_delete=models.PROTECT)
    
    def __str__(self):
        return self.Code

class DesignDetail(models.Model):
    ID=models.BigAutoField(primary_key=True)
    ID_Header=models.ForeignKey(DesignMaster,on_delete=models.PROTECT)
    Srl_Col=models.IntegerField()
    ID_Item=models.ForeignKey(ItemMaster,on_delete=models.PROTECT)
    ID_StoneM=models.ForeignKey(StoneMaster,on_delete=models.PROTECT)
    ID_StoneS=models.ForeignKey(StoneSubMaster,on_delete=models.PROTECT)
    Pcs=models.IntegerField()
    Weight=models.DecimalField(max_digits=10,decimal_places=3)

    def __str__(self):
        return self.ID

class StoneRateSetting(models.Model):
    ID=models.BigAutoField(primary_key=True)
    ID_StoneM=models.ForeignKey(StoneMaster,on_delete=models.PROTECT)
    Srl_Col=models.IntegerField()
    ID_StoneS=models.ForeignKey(StoneSubMaster,on_delete=models.PROTECT)
    ID_Color=models.ForeignKey(ColorMaster,on_delete=models.PROTECT)
    Pcs=models.IntegerField()
    Weight=models.DecimalField(max_digits=10,decimal_places=3)
    CP=models.DecimalField(max_digits=8,decimal_places=2)
    SP=models.DecimalField(max_digits=8,decimal_places=2)
    
    def __str__(self):
        return self.ID

class StoneRateSettingMiscCharge(models.Model):
    ID=models.BigAutoField(primary_key=True)
    ID_Header=models.ForeignKey(StoneRateSetting,on_delete=models.PROTECT)
    ID_MiscCharge=models.ForeignKey(MiscChargeMaster,on_delete=models.PROTECT)
    DamageCharge=models.DecimalField(max_digits=8,decimal_places=2)
    SettingCharge=models.DecimalField(max_digits=8,decimal_places=2)
    Amount=models.DecimalField(max_digits=8,decimal_places=2)

    def __str__(self):
        return self.ID

# All are mandatory except address,contact
class ArtisanMaster(models.Model):
    ID=models.BigAutoField(primary_key=True)
    Code=models.CharField(max_length=6,unique=True)
    Name=models.CharField(max_length=100)
    Address1=models.CharField(max_length=255,null=True,blank=True)
    Address2=models.CharField(max_length=255,null=True,blank=True)
    Address3=models.CharField(max_length=255,null=True,blank=True)
    Contact=models.CharField(max_length=30,null=True,blank=True)
    def __str__(self):
        return self.Code
    
class DealerMaster(models.Model):
    ID=models.BigAutoField(primary_key=True)
    Code=models.CharField(max_length=6,unique=True)
    Name=models.CharField(max_length=100)
    Address1=models.CharField(max_length=255,blank=True)
    Address2=models.CharField(max_length=255,blank=True)
    Address3=models.CharField(max_length=255,blank=True)
    Contact=models.CharField(max_length=30,blank=True)
    def __str__(self):
        return self.Code


# All are mandatory except address,contact.
class StaffMaster(models.Model):
    Staff_ID=models.BigAutoField(primary_key=True)
    Staff_Code=models.CharField(max_length=6,unique=True)
    Staff_Name=models.CharField(max_length=100)
    Address1=models.CharField(max_length=255,blank=True)
    Address2=models.CharField(max_length=255,blank=True)
    Address3=models.CharField(max_length=255,blank=True)
    Contact=models.CharField(max_length=30,blank=True)
    ID_master=models.ForeignKey(ProcessMaster,on_delete=models.PROTECT)
    def __str__(self):
        return self.Staff_Code

class CustomerMaster(models.Model):
    Customer_ID=models.BigAutoField(primary_key=True)
    # Check: Customer Code(Not Reqd)
    Customer_Name=models.CharField(max_length=100)
    # All are mandatory except address’s,contact.
    Address1=models.CharField(max_length=255,blank=True)
    Address2=models.CharField(max_length=255,blank=True)
    Address3=models.CharField(max_length=255,blank=True)
    Contact=models.CharField(max_length=30,blank=True)
    TYPE_A=1
    TYPE_B=2
    ID_CHOICES=[
        (TYPE_A,'Self'),
        (TYPE_B,'Customer'),
    ]
    ID_Type=models.CharField(max_length=1,choices=ID_CHOICES,default=TYPE_B)

    def __str__(self):
        return self.Customer_Name

class MappingTC(models.Model):
    TranCode=models.CharField(max_length=3)
    Interface=models.CharField(max_length=255)
    Table_Name=models.CharField(max_length=255)
    Prefix_Voucher=models.CharField(max_length=255)

    def __str__(self):
        return self.TranCode


# # Mapping Table:
# class ApiTransactionMap(models.Model):
#     transaction_code = models.CharField(max_length=20, unique=True)
#     description = models.CharField(max_length=100, null=True, blank=True)
#     endpoint = models.CharField(max_length=200)  # e.g. /colormaster/

#     def __str__(self):
#         return f"{self.transaction_code} -> {self.endpoint}"

