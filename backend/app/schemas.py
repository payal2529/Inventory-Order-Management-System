from pydantic import BaseModel, Field
from typing import Optional

class ProductBase(BaseModel):
    name: str
    sku: str
    price: float = Field(gt=0, description="Price must be greater than zero")
    quantity: int = Field(ge=0, description="Quantity must not be negative")

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

class CustomerBase(BaseModel):
    full_name: str
    email: str
    phone: str

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_id: int
    product_id: int
    quantity_ordered: int = Field(gt=0)

class Order(BaseModel):
    id: int
    customer_id: int
    product_id: int
    quantity_ordered: int
    total_amount: float
    
    class Config:
        from_attributes = True
