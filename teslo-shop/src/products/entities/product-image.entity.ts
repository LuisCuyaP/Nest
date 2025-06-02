import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({ name: 'product_images' })
export class ProductImage{

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    //muchas imagenes pueden tener un solo producto
    @ManyToOne(
        () => Product, // referencia a la entidad Product
        (product) => product.images, // propiedad de la entidad Product que hace referencia a las imágenes
        { onDelete: 'CASCADE' } // si se elimina el producto, se eliminan las imágenes asociadas
    )
    product: Product
}