import ProductService from "../models/Product.service";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { Request, Response } from "express";
import { ProductInput, ProductInquery } from "../libs/types/product";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { ProductCollection } from "../libs/enums/product.enum";
import { ObjectId } from "mongoose";

const productService = new ProductService();

const productController: T = {};
// SPA
productController.getProducts = async (req: Request, res: Response) => {
  try {
    // const query = req.query;
    // console.log("req.query:", query);
    // const param = req.params;
    // console.log("req.params:", param);
    console.log("getProducts");
    const { page, limit, order, productCollection, search } = req.query;
    // console.log(req.query);
    const inquery: ProductInquery = {
      order: String(order),
      page: Number(page),
      limit: Number(limit),
    };
    if (productCollection)
      inquery.productCollection = productCollection as ProductCollection;
    if (search) inquery.search = String(search);

    const result = await productService.getProducts(inquery);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

productController.getProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getProduct");

    const { id } = req.params;
    console.log("req.member:", req.member);
    const memberId = req.member?._id ?? null;
    const result = await productService.getProduct(
      memberId as unknown as ObjectId,
      id
    );

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

// BSSR

productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("getAllProducts");
    // console.log("req.member:", req.member);
    const data = await productService.getAllProducts();
    console.log("data:", data);
    res.render("products", { products: data });
  } catch (err) {
    console.log("Error, getAllProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

productController.createNewProduct = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("createNewProduct");
    // console.log("req.files:", req.files);
    // console.log("req.body:", req.body);

    if (!req.files?.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATED_FAILED);

    // TODO: QUESTION ABOUT REQUEST.BODY

    // console.log("req.body:", req.body);
    const data: ProductInput = req.body;
    data.productImages = req.files?.map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });
    console.log("data:", data);

    await productService.createNewProduct(data);

    res.send(
      `<script>alert("Successfull creation!"); window.location.replace('/admin/product/all')</script> `
    );
  } catch (err) {
    console.log("Error, createNewProduct:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script>alert("${message}"); window.location.replace('/admin/product/all')</script> `
    );
  }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenProduct");
    // console.log("request:", req);
    const id = req.params.id;
    // console.log("id:", id);

    const result = await productService.updateChosenProduct(id, req.body);

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateChosenProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

export default productController;