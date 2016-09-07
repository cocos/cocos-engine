sp._SGSkeleton = sp.Skeleton;
sp._SGSkeletonAnimation = sp.SkeletonAnimation;

sp._SGSkeleton.prototype.setPremultipliedAlpha = sp._SGSkeleton.prototype.setOpacityModifyRGB;

// 不能执行任何操作以免覆盖 premultiplied 属性
sp._SGSkeleton.prototype.setOpacityModifyRGB = function () {};
