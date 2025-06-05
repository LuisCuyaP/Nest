import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: 'd3b9f8c0-4c1e-4f2a-8b5e-6f7c8d9e0a1b',
        description: 'Product ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shit Teslo',
        description: 'Product Title',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product Price',
    })
    @Column('float',{
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Anim reprehenderit nulla in anim mollit minim irure commodo.',
        description: 'Product Description',
        default: null,
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 'T-Shit Teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product Stock',
        default: true,
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M', 'XL', 'XXL'],
        description: 'Product Sizes',
    })
    @Column('text',{
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'Women',
        description: 'Product Gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    // images
    //un producto puede tener muchas imagenes
    //relacion uno a muchos
    @ApiProperty()
    @OneToMany(
        () => ProductImage, // referencia a la entidad ProductImage
        (productImage) => productImage.product, // propiedad de la entidad ProductImage que hace referencia al producto
        { cascade: true, eager: true } // cascade: true permite que las operaciones se propaguen a las imágenes asociadas para poder eliminarlas
    )
    images?: ProductImage[];


    //muchos productos va a tener un usuario
    //en esta tabla se almacenara el new column id del usuario que creo el producto
    @ManyToOne(
        () => User, // referencia a la entidad User
        (user) => user.product, // propiedad de la entidad User que hace referencia a los productos
        { eager: true } // eager: true permite que el usuario asociado se cargue automáticamente al consultar el producto
    )
    user: User;


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