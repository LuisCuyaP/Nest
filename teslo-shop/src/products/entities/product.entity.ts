import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    title: string;

    @Column('float',{
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text', {
        unique: true
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text',{
        array: true
    })
    sizes: string[];

    @Column('text')
    gender: string;


    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    // images
    //un proucto puede tener muchas imagenes
    //relacion uno a muchos
    @OneToMany(
        () => ProductImage, // referencia a la entidad ProductImage
        (productImage) => productImage.product, // propiedad de la entidad ProductImage que hace referencia al producto
        { cascade: true, eager: true } // cascade: true permite que las operaciones se propaguen a las imágenes asociadas para poder eliminarlas
    )
    images?: ProductImage[];


    @BeforeInsert()
    checkSlugInsert() {

        if ( !this.slug ) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')

    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }



}