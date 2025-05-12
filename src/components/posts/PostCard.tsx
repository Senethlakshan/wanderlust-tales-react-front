import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle } from "lucide-react";
import { type Post } from "@/services/api";
import { Button } from "@/components/ui/button";

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, compact = false }) => {
  return (
    <Card className={`overflow-hidden h-full card-hover ${compact ? 'border-0 shadow-none' : ''}`}>
      <Link to={`/post/${post.id}`} className="block">
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      
      <CardHeader className={compact ? "px-0 pt-3 pb-0" : ""}>
        <div className="flex items-center gap-2 mb-2">
          <Link to={`/search?country=${post.country}`} className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full hover:bg-primary/20 transition-colors">
            {post.country}
          </Link>
          <span className="text-xs text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <Link to={`/post/${post.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-bold text-lg line-clamp-2">{post.title}</h3>
        </Link>
      </CardHeader>
      
      <CardContent className={compact ? "px-0" : ""}>
        <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
      </CardContent>
      
      <CardFooter className={`flex items-center justify-between ${compact ? "px-0 pt-1" : ""}`}>
        <div className="flex items-center gap-2">
          <Link to={`/profile/${post.author.id}`} className="flex items-center gap-2 hover:text-primary transition-colors">
            <Avatar className="h-7 w-7">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{post.author.username}</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span className="text-xs">{post.likes}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{post.comments}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
